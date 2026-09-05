'use client';

import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  Percent,
  DollarSign,
  Gift,
  HelpCircle,
  Save,
  X,
  AlertCircle,
} from 'lucide-react';
import { ServiceCouponScheme } from '@/app/api/services/coupons/route';

interface ServiceCouponsManagerProps {
  theme?: 'light' | 'dark';
}

const DEFAULT_COUPON_FORM: Partial<ServiceCouponScheme> = {
  code: '',
  title: '',
  description: '',
  schemeType: 'FIRST_M_OF_N_AT_PRICE',
  targetServices: ['all'],
  qualifyingQuantity: 3,
  discountedQuantity: 1,
  offerPrice: 1,
  discountValue: 0,
  minOrderValue: 0,
  isAutoApply: true,
  showBanner: true,
  badgeText: '⚡ 1ST KUNDLI AT ₹1',
  active: true,
};

export default function ServiceCouponsManager({ theme = 'light' }: ServiceCouponsManagerProps) {
  const [coupons, setCoupons] = useState<ServiceCouponScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<ServiceCouponScheme>>(DEFAULT_COUPON_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/services/coupons');
      const data = await res.json();
      if (data.success && Array.isArray(data.coupons)) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error('Failed to load service coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleOpenCreateModal = () => {
    setFormData({
      ...DEFAULT_COUPON_FORM,
      id: `sc-${Date.now()}`,
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (coupon: ServiceCouponScheme) => {
    setFormData({ ...coupon });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleToggleActive = async (coupon: ServiceCouponScheme) => {
    try {
      const updated = { ...coupon, active: !coupon.active };
      const res = await fetch('/api/services/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? updated : c)));
        showNotification('success', `Scheme "${coupon.title}" is now ${updated.active ? 'ACTIVE' : 'PAUSED'}.`);
      }
    } catch (err) {
      showNotification('error', 'Failed to update scheme status.');
    }
  };

  const handleDeleteCoupon = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete scheme "${title}"?`)) return;

    try {
      const res = await fetch(`/api/services/coupons?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        showNotification('success', `Scheme "${title}" deleted successfully.`);
      }
    } catch (err) {
      showNotification('error', 'Failed to delete scheme.');
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('Please enter a Scheme Title');
      return;
    }

    try {
      setIsSaving(true);
      const payload: ServiceCouponScheme = {
        id: formData.id || `sc-${Date.now()}`,
        code: (formData.code || '').trim().toUpperCase(),
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
        schemeType: formData.schemeType || 'FIRST_M_OF_N_AT_PRICE',
        targetServices: formData.targetServices && formData.targetServices.length > 0 ? formData.targetServices : ['all'],
        qualifyingQuantity: Number(formData.qualifyingQuantity) || 1,
        discountedQuantity: Number(formData.discountedQuantity) || 1,
        offerPrice: Number(formData.offerPrice) || 0,
        discountValue: Number(formData.discountValue) || 0,
        minOrderValue: Number(formData.minOrderValue) || 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
        isAutoApply: Boolean(formData.isAutoApply),
        showBanner: Boolean(formData.showBanner),
        badgeText: formData.badgeText || '',
        active: formData.active !== undefined ? Boolean(formData.active) : true,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
        usageCount: Number(formData.usageCount) || 0,
        createdAt: formData.createdAt || new Date().toISOString(),
      };

      const res = await fetch('/api/services/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showNotification('success', `Scheme "${payload.title}" saved successfully!`);
        setShowModal(false);
        fetchCoupons();
      } else {
        showNotification('error', data.error || 'Failed to save scheme.');
      }
    } catch (err) {
      showNotification('error', 'Error saving scheme. Please check network.');
    } finally {
      setIsSaving(false);
    }
  };

  const activeCount = coupons.filter((c) => c.active).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap justify-between items-center bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] gap-4 shadow-xl text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold uppercase mb-2 border border-amber-500/30">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Service Promotional Schemes & Coupon Engine
          </div>
          <h3 className="font-serif font-bold text-2xl text-[#faf8f4]">
            Astrology Service Coupons & Bundled Schemes
          </h3>
          <p className="text-xs text-gray-300 max-w-2xl mt-1">
            Configure offers like &ldquo;First 3 Kundlis: 1st at ₹1&rdquo;, flat rupees off, percentage vouchers, and auto-applied promotional discounts on Kuthi readings.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:opacity-95 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Scheme / Offer</span>
        </button>
      </div>

      {/* NOTIFICATION TOAST */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all shadow-md ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#fde68a] text-[#0f172a] shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Total Service Schemes</span>
          <div className="text-3xl font-black font-mono text-[#b45309]">{coupons.length}</div>
          <span className="text-[11px] text-slate-400">Configured in system</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-300 text-[#0f172a] shadow-xs space-y-1">
          <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider block">Live Active Offers</span>
          <div className="text-3xl font-black font-mono text-emerald-600">{activeCount}</div>
          <span className="text-[11px] text-slate-400">Currently live on frontend</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-sky-300 text-[#0f172a] shadow-xs space-y-1">
          <span className="text-xs text-sky-700 font-bold uppercase tracking-wider block">Total Customer Redemptions</span>
          <div className="text-3xl font-black font-mono text-sky-700">{totalRedemptions}</div>
          <span className="text-[11px] text-slate-400">Kundlis & services ordered</span>
        </div>
      </div>

      {/* SCHEME LIST */}
      <div className="bg-white rounded-3xl border border-[#fde68a] shadow-md p-6 space-y-5 text-[#0f172a]">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[#fde68a] pb-4">
          <div>
            <h4 className="font-serif font-bold text-xl text-[#b45309]">Active Schemes & Coupons Catalog</h4>
            <p className="text-xs text-gray-500">Edit values, toggle active status, or create new promotional schemes</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
            {coupons.length} Schemes Stored
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs font-medium">Loading promotional schemes...</div>
        ) : coupons.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-slate-500 text-sm">No service schemes configured yet.</p>
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs"
            >
              Create First Scheme
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((coupon) => {
              const isTieredScheme = coupon.schemeType === 'FIRST_M_OF_N_AT_PRICE';
              return (
                <div
                  key={coupon.id}
                  className={`p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between space-y-4 ${
                    coupon.active
                      ? 'bg-white border-[#facc15] shadow-sm hover:shadow-md'
                      : 'bg-slate-50 border-slate-200 opacity-75'
                  }`}
                >
                  {/* Top Row: Title & Badge */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-base text-slate-900">{coupon.title}</h5>
                          {coupon.badgeText && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#b45309] font-extrabold text-[10px] border border-amber-300">
                              {coupon.badgeText}
                            </span>
                          )}
                        </div>
                        {coupon.code ? (
                          <div className="inline-block font-mono font-black text-xs px-2.5 py-1 rounded-md bg-slate-900 text-amber-400 border border-slate-700">
                            CODE: {coupon.code}
                          </div>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            ✨ Auto-Applied to Order
                          </span>
                        )}
                      </div>

                      {/* Active Status Badge */}
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          coupon.active
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
                        }`}
                        title="Click to Toggle Active / Paused"
                      >
                        {coupon.active ? '● LIVE' : '○ PAUSED'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {coupon.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Scheme Formula Explanation Card */}
                  <div className="p-3 rounded-xl bg-[#fffdf7] border border-amber-200/90 text-xs space-y-1.5 font-sans">
                    <div className="font-bold text-[#b45309] flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Rule Formula & Breakdown</span>
                    </div>

                    {isTieredScheme ? (
                      <div className="text-[11px] text-slate-700 space-y-0.5">
                        <div>
                          • Buy <strong>{coupon.qualifyingQuantity} Kundlis together</strong>:
                        </div>
                        <div className="pl-3 text-emerald-800 font-bold">
                          ➜ 1st Kundli = ₹{coupon.offerPrice}
                        </div>
                        <div className="pl-3 text-slate-600">
                          ➜ Remaining {coupon.qualifyingQuantity - coupon.discountedQuantity} Kundlis = Normal Service Rate
                        </div>
                      </div>
                    ) : coupon.schemeType === 'PERCENTAGE' ? (
                      <div className="text-[11px] text-slate-700">
                        • Flat <strong>{coupon.discountValue}% Discount</strong> on total reading amount
                        {coupon.maxDiscount ? ` (Up to ₹${coupon.maxDiscount})` : ''}
                      </div>
                    ) : coupon.schemeType === 'FLAT' ? (
                      <div className="text-[11px] text-slate-700">
                        • Flat <strong>₹{coupon.discountValue} Off</strong> on eligible orders
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-700">
                        • First {coupon.qualifyingQuantity} items for flat ₹{coupon.offerPrice} total
                      </div>
                    )}

                    <div className="pt-1 text-[10px] text-slate-500 border-t border-amber-100 flex flex-wrap gap-x-3 gap-y-1">
                      <span>Target: <strong>{coupon.targetServices?.join(', ') || 'All Services'}</strong></span>
                      {coupon.minOrderValue > 0 && <span>Min Order: <strong>₹{coupon.minOrderValue}</strong></span>}
                      <span>Redeemed: <strong>{coupon.usageCount || 0} times</strong></span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${coupon.showBanner ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span className="text-[10px] font-bold text-slate-500">
                        {coupon.showBanner ? 'Banner Visible on Website' : 'Hidden from Banner'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(coupon)}
                        className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors cursor-pointer"
                        title="Edit Scheme"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id, coupon.title)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                        title="Delete Scheme"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-200 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-lg text-[#b45309]">
                    {isEditing ? 'Edit Service Scheme / Coupon' : 'Create New Promotional Scheme'}
                  </h4>
                  <p className="text-[11px] text-slate-500">Easily update prices, quantities, and auto-applied promotional discounts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs font-sans">
              {/* Row 1: Title & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                    Scheme Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 Kundli Special Scheme (1st at ₹1)"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-[#fefcf6] text-slate-900 font-bold focus:border-amber-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                    Coupon Code (Optional if Auto-Applied)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3KUNDLI1"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-[#fefcf6] text-slate-900 font-mono font-bold uppercase focus:border-amber-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                  Customer-Facing Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Order 3 Kundlis together — 1st Kundli at ₹1 only, rest at regular service rate!"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-[#fefcf6] text-slate-700 focus:border-amber-600 focus:outline-none"
                />
              </div>

              {/* Scheme Type Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                  Scheme Calculation Type *
                </label>
                <select
                  value={formData.schemeType}
                  onChange={(e) => setFormData({ ...formData, schemeType: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-amber-50/50 text-amber-950 font-bold focus:border-amber-600 focus:outline-none"
                >
                  <option value="FIRST_M_OF_N_AT_PRICE">
                    ★ Buy N Together: First M at Special ₹X (Remaining at Regular Rate)
                  </option>
                  <option value="PERCENTAGE">Percentage Discount (% Off Total)</option>
                  <option value="FLAT">Flat Rupee Discount (₹ Off Total)</option>
                  <option value="FIRST_N_AT_PRICE">First N Items for Fixed Total Price</option>
                  <option value="BUY_X_GET_Y">Buy X Get Y Free</option>
                </select>
              </div>

              {/* DYNAMIC PARAMETERS CARD */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <span className="font-bold text-amber-900 block text-xs">
                  {formData.schemeType === 'FIRST_M_OF_N_AT_PRICE'
                    ? '⚡ Tiered Scheme Parameters (e.g. 3 Kundli Bundle Offer)'
                    : 'Offer Calculation Parameters'}
                </span>

                {formData.schemeType === 'FIRST_M_OF_N_AT_PRICE' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Must Order Together (N)
                      </label>
                      <input
                        type="number"
                        min={2}
                        value={formData.qualifyingQuantity ?? 3}
                        onChange={(e) => setFormData({ ...formData, qualifyingQuantity: parseInt(e.target.value) || 3 })}
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-mono font-bold text-slate-900"
                        placeholder="3"
                      />
                      <span className="text-[9px] text-slate-500">e.g. 3 Kundlis</span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        First M Discounted
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={formData.discountedQuantity ?? 1}
                        onChange={(e) => setFormData({ ...formData, discountedQuantity: parseInt(e.target.value) || 1 })}
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-mono font-bold text-slate-900"
                        placeholder="1"
                      />
                      <span className="text-[9px] text-slate-500">e.g. 1st Kundli</span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Special Price (₹X)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={formData.offerPrice ?? 1}
                        onChange={(e) => setFormData({ ...formData, offerPrice: parseInt(e.target.value) || 0 })}
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-mono font-bold text-amber-700"
                        placeholder="1"
                      />
                      <span className="text-[9px] text-slate-500">e.g. ₹1</span>
                    </div>
                  </div>
                )}

                {formData.schemeType === 'PERCENTAGE' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Discount (%) *</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={formData.discountValue ?? 20}
                        onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) || 0 })}
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Max Cap (₹, Optional)</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.maxDiscount ?? ''}
                        onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-mono"
                        placeholder="No limit"
                      />
                    </div>
                  </div>
                )}

                {formData.schemeType === 'FLAT' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Flat Discount (₹) *</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.discountValue ?? 100}
                      onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) || 0 })}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-mono font-bold text-emerald-700"
                    />
                  </div>
                )}

                {/* Target Service & Min Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Eligible Service</label>
                    <select
                      value={formData.targetServices?.[0] || 'all'}
                      onChange={(e) => setFormData({ ...formData, targetServices: [e.target.value] })}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                    >
                      <option value="all">All Services (Kuthi Yengba, Kuthi Iba, etc.)</option>
                      <option value="/manipuri_kuthi_yengba">Kuthi Yengba (/manipuri_kuthi_yengba)</option>
                      <option value="/manipuri_kuthi">Kuthi Iba Creation (/manipuri_kuthi)</option>
                      <option value="/numit_leppa_yengba">Numit Leppa (/numit_leppa_yengba)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Min Order Value (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.minOrderValue ?? 0}
                      onChange={(e) => setFormData({ ...formData, minOrderValue: parseInt(e.target.value) || 0 })}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-mono text-xs"
                      placeholder="0 = No minimum"
                    />
                  </div>
                </div>
              </div>

              {/* Badges & Display Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                    Promotional Badge Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ⚡ 1ST KUNDLI AT ₹1"
                    value={formData.badgeText || ''}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-[#fefcf6] text-amber-900 font-extrabold focus:border-amber-600 focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                    Usage Limit (Max Redemptions)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 5000"
                    value={formData.usageLimit ?? ''}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-[#fefcf6] text-slate-800 font-mono focus:border-amber-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isAutoApply}
                    onChange={(e) => setFormData({ ...formData, isAutoApply: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Auto-Apply to Qualifying Orders (No need for customer to manually enter code)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.showBanner}
                    onChange={(e) => setFormData({ ...formData, showBanner: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Show Promotional Banner on Services Section & Booking Pages</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Active & Live</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:opacity-95 text-white font-extrabold text-xs shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : isEditing ? 'Update Scheme Live' : 'Create & Publish Scheme'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
