'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  UserCircle, Mail, Phone, MapPin, KeyRound, Save, Plus, X, 
  CheckCircle2, ArrowLeft, ShieldCheck, User, Calendar, LogOut, LayoutDashboard, Sparkles
} from 'lucide-react';

const DEFAULT_USER = {
  name: "Nganba Meitei",
  email: "abc@gmail.com",
  phone: "+91 90123 45678",
  whatsapp: "+91 90123 45678",
  sex: "Male",
  address: "Uripok, Imphal West, Manipur, 795001",
  deliveryAddress: "Uripok, Imphal West, Manipur, 795001",
  sameAsResident: true,
  deliveryAddresses: [
    "Uripok Tourangbam Leikai, Imphal West, Manipur - 795001",
  ],
  memberSince: "2026"
};

export default function UserProfilePage() {
  const [userProfile, setUserProfile] = useState(DEFAULT_USER);
  const [editForm, setEditForm] = useState(DEFAULT_USER);
  const [successMsg, setSuccessMsg] = useState('');
  const [newAddrInput, setNewAddrInput] = useState('');
  const [showAddAddrInput, setShowAddAddrInput] = useState(false);

  // Change Password State
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kanglei_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUserProfile((prev) => ({ ...prev, ...parsed }));
          setEditForm((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(editForm);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kanglei_user', JSON.stringify(editForm));
      window.dispatchEvent(new Event('user-login-change'));
    }
    setSuccessMsg('✅ Profile and address details updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddDeliveryAddress = () => {
    if (newAddrInput.trim()) {
      const existing = editForm.deliveryAddresses || [];
      const updated = [...existing, newAddrInput.trim()];
      setEditForm({ ...editForm, deliveryAddresses: updated });
      setNewAddrInput('');
      setShowAddAddrInput(false);
    }
  };

  const handleRemoveDeliveryAddress = (index: number) => {
    const existing = editForm.deliveryAddresses || [];
    const updated = existing.filter((_, i) => i !== index);
    setEditForm({ ...editForm, deliveryAddresses: updated });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdMsg('');

    if (newPwd !== confirmPwd) {
      setPwdError('New passwords do not match!');
      return;
    }
    if (newPwd.length < 4) {
      setPwdError('Password must be at least 4 characters.');
      return;
    }

    setPwdLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CHANGE_PASSWORD',
          identifier: userProfile.email || userProfile.phone,
          currentPassword: currentPwd,
          newPassword: newPwd,
        }),
      });
      const data = await res.json();
      setPwdLoading(false);

      if (!res.ok) {
        setPwdError(data.error || 'Password update failed.');
        return;
      }

      setPwdMsg('✅ Account password updated successfully!');
      setTimeout(() => {
        setShowPwdModal(false);
        setPwdMsg('');
        setCurrentPwd('');
        setNewPwd('');
        setConfirmPwd('');
      }, 2000);
    } catch (err: any) {
      setPwdLoading(false);
      setPwdError(err.message || 'Error changing password');
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] pt-6 pb-20 font-sans text-[#0f172a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Link 
            href="/dashboard/client"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#b45309] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Member since {userProfile.memberSince || '2026'}</span>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-[#f3e8d2] shadow-sm p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#d97706] to-[#b45309] text-white flex items-center justify-center text-3xl font-serif font-bold shadow-md shrink-0">
              {userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('') : 'U'}
            </div>
            
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#0f172a]">
                  {userProfile.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef3c7] border border-[#fde68a] text-xs font-extrabold text-[#b45309] self-center sm:self-auto">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Account
                </span>
              </div>
              <p className="text-xs text-gray-600 font-medium">
                Manage your personal information, contact numbers, residential & delivery addresses
              </p>
              <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-gray-600 font-medium">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#d97706]" /> {userProfile.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#d97706]" /> {userProfile.phone}</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#d97706]" /> {userProfile.sex}</span>
              </div>
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center animate-fadeIn shadow-xs">
            {successMsg}
          </div>
        )}

        {/* Profile Details Form */}
        <form onSubmit={handleSaveProfile} className="space-y-8">
          
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-3xl border border-[#f3e8d2] shadow-sm p-6 sm:p-8 space-y-5 relative overflow-hidden">
            <div className="flex items-center gap-3 pb-4 border-b border-[#f3e8d2]">
              <div className="w-9 h-9 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                <UserCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-[#0f172a]">Personal & Contact Information</h2>
                <p className="text-xs text-gray-500">Your registered profile contact details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans">
              <div>
                <label className="block font-bold text-[#0f172a] mb-1.5 uppercase tracking-wider text-[11px]">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0f172a] mb-1.5 uppercase tracking-wider text-[11px]">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0f172a] mb-1.5 uppercase tracking-wider text-[11px]">
                  Phone / Mobile Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value, whatsapp: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-mono font-bold focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0f172a] mb-1.5 uppercase tracking-wider text-[11px]">
                  Gender / Sex
                </label>
                <select
                  value={editForm.sex || 'Male'}
                  onChange={(e) => setEditForm({ ...editForm, sex: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Residential & Delivery Addresses */}
          <div className="bg-white rounded-3xl border border-[#f3e8d2] shadow-sm p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center gap-3 pb-4 border-b border-[#f3e8d2]">
              <div className="w-9 h-9 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-[#0f172a]">Residential & Delivery Addresses</h2>
                <p className="text-xs text-gray-500">Manage separate shipping locations for printed Kundli scroll deliveries</p>
              </div>
            </div>

            {/* Residential Address */}
            <div className="space-y-2">
              <label className="block font-bold text-[#0f172a] uppercase tracking-wider text-[11px]">
                Residential Address<span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={editForm.address || ''}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                placeholder="Enter street, house no., city, state & pincode"
              />
            </div>

            {/* Delivery Same Checkbox */}
            <div className="pt-1">
              <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.sameAsResident !== false}
                  onChange={(e) => setEditForm({ ...editForm, sameAsResident: e.target.checked })}
                  className="rounded text-[#d97706] focus:ring-[#d97706] cursor-pointer"
                />
                <span>Delivery address same as residential address</span>
              </label>
            </div>

            {/* Separate Primary Delivery Address */}
            {editForm.sameAsResident === false && (
              <div className="space-y-2 pt-1 animate-fadeIn">
                <label className="block font-bold text-[#0f172a] uppercase tracking-wider text-[11px]">
                  Primary Delivery Address<span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required={editForm.sameAsResident === false}
                  value={editForm.deliveryAddress || ''}
                  onChange={(e) => setEditForm({ ...editForm, deliveryAddress: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                  placeholder="Enter separate shipping / delivery address"
                />
              </div>
            )}

            {/* Multiple Delivery Addresses List & Add More */}
            <div className="pt-4 border-t border-[#f3e8d2] space-y-3">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-[#0f172a] uppercase tracking-wider text-[11px]">
                  Saved Delivery Addresses ({editForm.deliveryAddresses?.length || 0})
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddAddrInput(!showAddAddrInput)}
                  className="text-xs font-bold text-[#b45309] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More Delivery Address</span>
                </button>
              </div>

              {/* List */}
              {editForm.deliveryAddresses && editForm.deliveryAddresses.length > 0 && (
                <div className="space-y-2.5">
                  {editForm.deliveryAddresses.map((addr, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-[#fef3c7]/50 border border-[#fde68a] text-xs">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#d97706] mt-0.5 shrink-0" />
                        <span className="text-gray-900 font-semibold leading-relaxed">{addr}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliveryAddress(idx)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer shrink-0"
                        title="Remove Address"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Input */}
              {showAddAddrInput && (
                <div className="flex items-center gap-2 pt-2 animate-fadeIn">
                  <input
                    type="text"
                    placeholder="e.g. Office: House 14, Keishampat, Imphal West - 795001"
                    value={newAddrInput}
                    onChange={(e) => setNewAddrInput(e.target.value)}
                    className="flex-1 h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-xs font-medium focus:border-[#d97706] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliveryAddress}
                    className="h-11 px-5 bg-gradient-to-r from-[#b45309] to-[#d97706] text-white font-extrabold rounded-xl text-xs shrink-0 cursor-pointer shadow-sm hover:opacity-95"
                  >
                    Save Address
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#f3e8d2] shadow-sm">
            <button
              type="button"
              onClick={() => setShowPwdModal(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#f3e8d2] bg-gray-50 hover:bg-amber-50 text-gray-800 hover:text-[#b45309] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <KeyRound className="w-4 h-4 text-[#d97706]" />
              <span>Change Account Password</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/dashboard/client"
                className="flex-1 sm:flex-none text-center px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-7 py-3 rounded-xl bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        </form>

      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPwdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#f3e8d2] shadow-2xl p-6 space-y-4 text-xs text-[#0f172a]">
            <div className="flex justify-between items-center pb-3 border-b border-[#f3e8d2]">
              <h3 className="font-serif font-bold text-lg text-[#b45309] flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#d97706]" />
                Change Account Password
              </h3>
              <button onClick={() => setShowPwdModal(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {pwdMsg && <div className="p-3 bg-green-50 border border-green-200 text-green-800 font-bold text-center rounded-xl">{pwdMsg}</div>}
            {pwdError && <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-bold text-center rounded-xl">{pwdError}</div>}

            <form onSubmit={handleChangePassword} className="space-y-3 font-sans">
              <div>
                <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider text-[10px]">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-[#fefcf6] font-medium focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider text-[10px]">New Password</label>
                <input
                  type="password"
                  required
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-[#fefcf6] font-medium focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider text-[10px]">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-[#fefcf6] font-medium focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#f3e8d2]">
                <button type="button" onClick={() => setShowPwdModal(false)} className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold">Cancel</button>
                <button type="submit" disabled={pwdLoading} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#b45309] to-[#d97706] text-white font-extrabold shadow-md">
                  {pwdLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
