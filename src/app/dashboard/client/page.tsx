'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LogOut, FileText, Clock, Download, MapPin, Phone, Mail, 
  Calendar, CreditCard, Plus, Eye, ChevronRight, UserCircle,
  Activity, ShoppingBag, FileDown, CheckCircle2, Sparkles, X, Star, KeyRound
} from 'lucide-react';

interface KuthiOrder {
  id: string;
  orderRef: string;
  clientName: string;
  sex: string;
  mobile: string;
  whatsappNo: string;
  email?: string;
  dob?: string;
  tob?: string;
  pob?: string;
  question?: string;
  utr: string;
  submittedAt: string;
  amount: number;
  serviceType: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_ANALYSIS' | 'REPORT_RECEIVED' | 'COMPLETED';
  assignedAstrologerId?: string;
  assignedAstrologerName?: string;
  reportReceivedFromAstro?: boolean;
  reportFileName?: string;
  reportFileUrl?: string;
  reportUploadedAt?: string;
  reportUploadedBy?: string;
  reportNotes?: string;
}

const MOCK_USER = {
  name: "Client User",
  email: "client@kangleiastro.com",
  phone: "+91 98620 99881",
  whatsapp: "+91 98620 99881",
  sex: "Client",
  address: "Imphal West, Manipur, 795001",
  memberSince: "2026"
};

const KUNDLI_PROFILES = [
  { name: "Nganba Meitei", dob: "15 May 1995", tob: "10:30 AM", place: "Imphal West, Manipur" },
  { name: "Thoibi Ningthoujam", dob: "12 Apr 1996", tob: "08:30 AM", place: "Imphal East, Manipur" },
];

const DEFAULT_REPORTS = [
  { name: "30-Page Vedic Kundli Report (Nganba)", date: "15 Jan 2026", type: "PDF", url: "/sample_kuthi_report.pdf" },
  { name: "Marriage Ashtakoot Compatibility Report", date: "20 Feb 2026", type: "PDF", url: "/sample_kuthi_report.pdf" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING': return <span className="px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">PENDING</span>;
    case 'ASSIGNED': return <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">ASSIGNED GURU</span>;
    case 'IN_ANALYSIS': return <span className="px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">IN ANALYSIS</span>;
    case 'REPORT_RECEIVED': return <span className="px-3 py-1 text-xs font-semibold bg-teal-100 text-teal-800 rounded-full">REPORT READY</span>;
    case 'COMPLETED': return <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">COMPLETED</span>;
    default: return <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">{status}</span>;
  }
};

export default function ClientDashboard() {
  const [orders, setOrders] = useState<KuthiOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedReportOrder, setSelectedReportOrder] = useState<KuthiOrder | null>(null);

  // User Profile State
  const [userProfile, setUserProfile] = useState(MOCK_USER);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editForm, setEditForm] = useState(MOCK_USER);
  const [profileMsg, setProfileMsg] = useState('');

  // Password Change Modal State
  const [showClientPwdModal, setShowClientPwdModal] = useState(false);
  const [clientCurrentPwd, setClientCurrentPwd] = useState('');
  const [clientNewPwd, setClientNewPwd] = useState('');
  const [clientConfirmPwd, setClientConfirmPwd] = useState('');
  const [clientPwdMsg, setClientPwdMsg] = useState('');
  const [clientPwdError, setClientPwdError] = useState('');
  const [clientPwdLoading, setClientPwdLoading] = useState(false);

  const handleClientUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientPwdError('');
    setClientPwdMsg('');

    if (clientNewPwd !== clientConfirmPwd) {
      setClientPwdError('New passwords do not match!');
      return;
    }

    if (clientNewPwd.length < 4) {
      setClientPwdError('Password must be at least 4 characters long.');
      return;
    }

    setClientPwdLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CHANGE_PASSWORD',
          identifier: userProfile.email || userProfile.phone,
          currentPassword: clientCurrentPwd,
          newPassword: clientNewPwd,
        }),
      });

      const data = await res.json();
      setClientPwdLoading(false);

      if (!res.ok) {
        setClientPwdError(data.error || 'Password update failed.');
        return;
      }

      setClientPwdMsg('✅ Account password updated successfully!');
      setTimeout(() => {
        setShowClientPwdModal(false);
        setClientPwdMsg('');
        setClientCurrentPwd('');
        setClientNewPwd('');
        setClientConfirmPwd('');
      }, 2000);
    } catch (err: any) {
      setClientPwdLoading(false);
      setClientPwdError(err.message || 'Failed to update password');
    }
  };

  // Review Modal State
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    serviceName: 'Kuthi Yengba Consultation',
    location: 'Imphal, Manipur',
    comment: '',
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return;

    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SUBMIT_REVIEW',
          review: {
            clientName: userProfile.name,
            location: reviewForm.location || 'Imphal, Manipur',
            rating: reviewForm.rating,
            comment: reviewForm.comment,
            serviceName: reviewForm.serviceName,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviewSuccessMsg('✅ Thank you! Your review has been submitted for admin verification.');
        setTimeout(() => {
          setReviewSuccessMsg('');
          setShowWriteReviewModal(false);
          setReviewForm({ rating: 5, serviceName: 'Kuthi Yengba Consultation', location: 'Imphal, Manipur', comment: '' });
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Fetch live user session from localStorage
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
    setProfileMsg('✅ Profile contact details updated successfully!');
    setTimeout(() => {
      setProfileMsg('');
      setShowEditProfileModal(false);
    }, 1200);
  };

  // Fetch live orders from /api/kuthi
  useEffect(() => {
    fetch('/api/kuthi')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
        setLoadingOrders(false);
      })
      .catch((err) => {
        console.error('Error fetching client orders:', err);
        setLoadingOrders(false);
      });
  }, []);

  const completedCount = orders.filter(o => o.status === 'COMPLETED' || o.status === 'REPORT_RECEIVED' || o.reportFileName).length;
  const totalSpent = orders.reduce((acc, o) => acc + (o.amount || 499), 0);

  const STATS = [
    { label: "Total Orders", value: orders.length ? String(orders.length) : "3", icon: ShoppingBag, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Active Consultations", value: String(Math.max(0, orders.length - completedCount)), icon: Activity, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Reports Ready / Downloaded", value: String(completedCount || 2), icon: FileDown, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, icon: CreditCard, color: "text-purple-600", bg: "bg-purple-100" }
  ];

  return (
    <div className="min-h-screen bg-[#fffdfa] pt-32 pb-16 font-sans text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#b45309]">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {userProfile.name || 'Client'}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/booking" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b] text-white font-medium rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              <Plus className="w-5 h-5" />
              Book Consultation
            </Link>
            <button
              onClick={() => setShowWriteReviewModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Star className="w-4 h-4 text-yellow-200 fill-yellow-200" />
              Write a Review
            </button>
            <Link href="/auth" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#f3e8d2] text-gray-700 font-bold text-xs sm:text-sm rounded-xl hover:bg-gray-50 transition-colors shadow-xs">
              <LogOut className="w-4 h-4" />
              Logout
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {STATS.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-[#f3e8d2] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-serif font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Consultation Orders Table with Report Download Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-[#f3e8d2] shadow-sm overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />
              <div className="p-6 border-b border-[#f3e8d2] flex justify-between items-center">
                <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#d97706]" />
                  My Consultation Orders & Uploaded Reports
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-amber-50/50 border-b border-[#f3e8d2]">
                      <th className="p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Order Ref</th>
                      <th className="p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Service Type</th>
                      <th className="p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Assigned Guru</th>
                      <th className="p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-xs font-bold text-gray-700 uppercase tracking-wider text-right">Actions / Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3e8d2]">
                    {orders.map((order) => {
                      const isReady = order.status === 'COMPLETED' || order.status === 'REPORT_RECEIVED' || order.reportFileName;
                      return (
                        <tr key={order.id} className="hover:bg-amber-50/20 transition-colors">
                          <td className="p-4 text-sm font-mono font-bold text-[#b45309] whitespace-nowrap">{order.orderRef}</td>
                          <td className="p-4 text-sm text-gray-900 font-medium">{order.serviceType || 'Kuthi Yengba Consultation'}</td>
                          <td className="p-4 text-sm text-gray-600 font-medium">
                            {order.assignedAstrologerName || 'Master Vedic Astrologer'}
                          </td>
                          <td className="p-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                          <td className="p-4 text-right whitespace-nowrap">
                            {isReady ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setSelectedReportOrder(order)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-[#b45309] rounded-lg text-xs font-bold transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" /> View
                                </button>
                                <a
                                  href={order.reportFileUrl || '/sample_kuthi_report.pdf'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg text-xs font-extrabold shadow-sm transition-all"
                                >
                                  <Download className="w-3.5 h-3.5" /> Download Report
                                </a>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic">Report under preparation</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Purchased Reports Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-[#f3e8d2] shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />
              <div className="p-6 border-b border-[#f3e8d2] flex justify-between items-center">
                <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                  <FileDown className="w-5 h-5 text-[#d97706]" />
                  My Downloadable Astrological Reports
                </h2>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  PDF Download Available
                </span>
              </div>
              <div className="p-6 space-y-4">
                {/* Dynamically render completed reports from /api/kuthi + default reports */}
                {orders.filter(o => o.status === 'COMPLETED' || o.status === 'REPORT_RECEIVED' || o.reportFileName).map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#f3e8d2] rounded-xl bg-emerald-50/30 hover:bg-emerald-50/60 transition-colors group gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 shrink-0 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{order.reportFileName || `${order.serviceType} Report (${order.clientName})`}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Uploaded by: <strong className="text-gray-700">{order.reportUploadedBy || order.assignedAstrologerName || 'Acharya Tombi Sharma'}</strong> • Order {order.orderRef}
                        </p>
                        {order.reportNotes && (
                          <p className="text-xs text-gray-600 italic mt-1 bg-white p-2 rounded-md border border-emerald-100">
                            &ldquo;{order.reportNotes}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                    <a
                      href={order.reportFileUrl || '/sample_kuthi_report.pdf'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-extrabold rounded-lg transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </a>
                  </div>
                ))}

                {DEFAULT_REPORTS.map((report, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#f3e8d2] rounded-xl hover:bg-[#fffdfa] transition-colors group gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 shrink-0 bg-orange-50 text-[#d97706] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-500">Generated on {report.date} • {report.type}</p>
                      </div>
                    </div>
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-2.5 text-[#d97706] hover:bg-orange-50 rounded-lg transition-colors border border-[#f3e8d2]"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Sidebar Area */}
          <div className="w-full lg:w-1/3 space-y-8">
            
            {/* Profile Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-[#f3e8d2] shadow-sm relative overflow-hidden p-6"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 shrink-0 bg-gradient-to-br from-[#d97706] to-[#b45309] text-white rounded-full flex items-center justify-center text-2xl font-serif font-bold shadow-inner">
                  {userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('') : 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif">{userProfile.name}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Member since {userProfile.memberSince}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-[#d97706]" /> {userProfile.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-[#d97706]" /> {userProfile.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <UserCircle className="w-4 h-4 text-[#d97706]" /> {userProfile.sex}
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-[#d97706] mt-0.5 shrink-0" /> {userProfile.address}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setEditForm(userProfile);
                    setShowEditProfileModal(true);
                  }}
                  className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 border border-[#f3e8d2] rounded-xl text-xs font-extrabold text-[#b45309] transition-colors shadow-xs cursor-pointer"
                >
                  Edit Contact Details & Profile
                </button>
                <button
                  onClick={() => setShowClientPwdModal(true)}
                  className="w-full py-2.5 bg-gray-50 hover:bg-amber-50 border border-[#f3e8d2] rounded-xl text-xs font-bold text-gray-700 hover:text-[#b45309] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#d97706]" />
                  Change Account Password
                </button>
              </div>
            </motion.div>

            {/* Saved Kundli Profiles */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-[#f3e8d2] shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />
              <div className="p-6 border-b border-[#f3e8d2] flex justify-between items-center">
                <h2 className="text-lg font-serif font-bold">Saved Kundli Profiles</h2>
              </div>
              <div className="p-6 space-y-4">
                {KUNDLI_PROFILES.map((profile, i) => (
                  <div key={i} className="p-4 border border-[#f3e8d2] rounded-xl hover:border-[#d97706] transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#d97706] transition-colors">{profile.name}</h3>
                      <Link href="/kundli" className="text-gray-400 group-hover:text-[#d97706]"><Eye className="w-4 h-4" /></Link>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div><span className="font-medium">DOB:</span> {profile.dob}</div>
                      <div><span className="font-medium">TOB:</span> {profile.tob}</div>
                      <div className="col-span-2"><span className="font-medium">Place:</span> {profile.place}</div>
                    </div>
                  </div>
                ))}
                
                <Link href="/kundli" className="w-full py-3 border-2 border-dashed border-[#f3e8d2] rounded-xl text-sm font-medium text-[#d97706] hover:bg-[#fffdfa] transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add New Birth Profile
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ========================== CLIENT REPORT PREVIEW MODAL ========================== */}
      {selectedReportOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedReportOrder(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#f3e8d2] shadow-2xl p-6 space-y-5 z-10 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#f3e8d2]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#b45309] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#d97706]" />
                  Your Astrological Consultation Report
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">Order Ref: <strong className="font-mono text-gray-800">{selectedReportOrder.orderRef}</strong></p>
              </div>
              <button onClick={() => setSelectedReportOrder(null)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60">
                <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Report Document Title</div>
                <div className="text-sm font-serif font-bold text-[#0f172a] mt-0.5">
                  {selectedReportOrder.reportFileName || `${selectedReportOrder.serviceType} Report`}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Prepared by: <strong className="text-[#b45309]">{selectedReportOrder.reportUploadedBy || selectedReportOrder.assignedAstrologerName || 'Acharya Tombi Sharma'}</strong>
                </div>
              </div>

              {selectedReportOrder.reportNotes && (
                <div className="bg-white p-4 rounded-2xl border border-[#f3e8d2]">
                  <div className="text-[10px] uppercase font-bold text-[#b45309] tracking-wider mb-1">Guru&apos;s Remedial Guidance Summary</div>
                  <p className="text-xs text-gray-700 italic leading-relaxed">
                    &ldquo;{selectedReportOrder.reportNotes}&rdquo;
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
                <span>Format: PDF Document</span>
                <span>Status: Verified & Published</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#f3e8d2]">
              <button
                onClick={() => setSelectedReportOrder(null)}
                className="px-4 py-2.5 rounded-xl border border-[#f3e8d2] text-gray-700 font-bold text-xs hover:bg-gray-50"
              >
                Close
              </button>
              <a
                href={selectedReportOrder.reportFileUrl || '/sample_kuthi_report.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md flex items-center gap-2 hover:shadow-lg"
              >
                <Download className="w-4 h-4" /> Download Complete Report (PDF)
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================== EDIT CONTACT DETAILS MODAL ========================== */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowEditProfileModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#f3e8d2] shadow-2xl p-6 space-y-4 z-10 text-xs text-[#0f172a]">
            <div className="flex justify-between items-center pb-3 border-b border-[#f3e8d2]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#b45309] flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-[#d97706]" />
                  Edit Profile & Contact Details
                </h3>
                <p className="text-gray-500 text-[11px]">Update your name, mobile, email, and delivery address</p>
              </div>
              <button onClick={() => setShowEditProfileModal(false)} className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileMsg && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold text-center">
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3 font-sans">
              <div>
                <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#f3e8d2] bg-[#fffdfa] text-gray-900 font-semibold focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#f3e8d2] bg-[#fffdfa] text-gray-900 font-semibold focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Phone / Mobile<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value, whatsapp: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#f3e8d2] bg-[#fffdfa] text-gray-900 font-semibold focus:border-[#d97706] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Gender / Sex
                  </label>
                  <select
                    value={editForm.sex}
                    onChange={(e) => setEditForm({ ...editForm, sex: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#f3e8d2] bg-[#fffdfa] text-gray-900 font-semibold focus:border-[#d97706] focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Residential / Delivery Address
                </label>
                <textarea
                  rows={2}
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#f3e8d2] bg-[#fffdfa] text-gray-900 font-medium focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#f3e8d2]">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#f3e8d2] text-gray-700 font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#b45309] to-[#d97706] text-white font-extrabold shadow-md hover:opacity-95 cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WRITE CUSTOMER REVIEW MODAL */}
      {showWriteReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#fde68a] shadow-2xl max-w-lg w-full p-6 sm:p-8 relative text-[#0f172a] space-y-5">
            <button
              onClick={() => setShowWriteReviewModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-extrabold uppercase">
                <Star className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                Customer Feedback
              </div>
              <h3 className="text-2xl font-serif font-extrabold">Write a Service Review</h3>
              <p className="text-xs text-gray-600 font-medium">
                Your review will be verified by admin and displayed on our client testimonials wall.
              </p>
            </div>

            {reviewSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold text-center">
                {reviewSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 font-sans text-xs sm:text-sm">
                <div>
                  <label className="block text-gray-800 font-extrabold mb-1.5 uppercase tracking-wider text-[11px]">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1 text-2xl focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= reviewForm.rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-gray-300 fill-gray-100'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-extrabold text-amber-700 text-sm">{reviewForm.rating} / 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-800 font-extrabold mb-1 uppercase tracking-wider text-[11px]">
                    Service Consulted
                  </label>
                  <select
                    value={reviewForm.serviceName}
                    onChange={(e) => setReviewForm({ ...reviewForm, serviceName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#f3e8d2] bg-[#fefcf6] text-gray-900 font-bold focus:border-[#d97706] focus:outline-none"
                  >
                    <option value="Kuthi Yengba Consultation">Kuthi Yengba Consultation</option>
                    <option value="Kuthi Iba (কুঠি ইবা)">Kuthi Iba (কুঠি ইবা)</option>
                    <option value="Marriage Matching (পক্ন-ৱাইনবা য়েংবা)">Marriage Matching</option>
                    <option value="Career & Financial Outlook">Career & Financial Outlook</option>
                    <option value="30-Page Kuthi Report">30-Page Kuthi Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-800 font-extrabold mb-1 uppercase tracking-wider text-[11px]">
                    Location / City
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewForm.location}
                    onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#f3e8d2] bg-[#fefcf6] text-gray-900 font-bold focus:border-[#d97706] focus:outline-none"
                    placeholder="e.g. Imphal, Manipur"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-extrabold mb-1 uppercase tracking-wider text-[11px]">
                    Detailed Review / Testimonial
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#f3e8d2] bg-[#fefcf6] text-gray-900 font-medium focus:border-[#d97706] focus:outline-none"
                    placeholder="Share your consultation experience and prediction accuracy..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowWriteReviewModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CLIENT CHANGE PASSWORD MODAL */}
      {showClientPwdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#f3e8d2] shadow-2xl max-w-md w-full p-6 space-y-4 text-[#0f172a] text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#d97706] text-white flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#0f172a]">Change Account Password</h3>
                  <p className="text-xs text-gray-500">Update your client portal password</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowClientPwdModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {clientPwdError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                ⚠️ {clientPwdError}
              </div>
            )}

            {clientPwdMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                {clientPwdMsg}
              </div>
            )}

            <form onSubmit={handleClientUpdatePassword} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={clientCurrentPwd}
                  onChange={(e) => setClientCurrentPwd(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 4 characters"
                  value={clientNewPwd}
                  onChange={(e) => setClientNewPwd(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-type new password"
                  value={clientConfirmPwd}
                  onChange={(e) => setClientConfirmPwd(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowClientPwdModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={clientPwdLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b45309] to-[#d97706] text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  {clientPwdLoading ? 'Saving...' : 'Update Password →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
