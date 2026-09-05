'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LogOut, FileText, Clock, Download, MapPin, Phone, Mail, 
  Calendar, CreditCard, Plus, Eye, ChevronRight, UserCircle,
  Activity, ShoppingBag, FileDown, CheckCircle2, Sparkles, X, XCircle, Star, KeyRound,
  Truck, Ban, Printer, MessageSquare, AlertTriangle, ShieldCheck, Image as ImageIcon, Video
} from 'lucide-react';
import LiveConsultationRoom from '@/components/consultation/LiveConsultationRoom';

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
  paymentStatus?: 'PAYMENT_RECEIVED' | 'PAYMENT_NOT_RECEIVED' | 'VERIFICATION_PENDING';
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

interface ShopOrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  sellerName?: string;
}

interface ShopOrder {
  id: string;
  orderRef: string;
  buyerName: string;
  mobile: string;
  address: string;
  pincode: string;
  items: ShopOrderItem[];
  totalAmount: number;
  utr: string;
  status: 'PAYMENT_PENDING' | 'PAID' | 'ENERGIZING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus?: 'PAYMENT_RECEIVED' | 'PAYMENT_NOT_RECEIVED' | 'VERIFICATION_PENDING';
  orderedAt: string;
  courierPartner?: string;
  trackingNumber?: string;
  cancelReason?: string;
  cancelledAt?: string;
}

const DEFAULT_SHOP_ORDERS: ShopOrder[] = [
  {
    id: "shop-order-101",
    orderRef: "ESTORE-2026-981",
    buyerName: "Nganba Meitei",
    mobile: "+91 90123 45678",
    address: "Uripok Tourangbam Leikai, Imphal West, Manipur - 795001",
    pincode: "795001",
    items: [
      {
        productId: "prod-1",
        title: "Natural Ceylon Yellow Sapphire (Pukhraj) 5.25 Ratti",
        price: 6999,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
        sellerName: "Acharya Tombi Sharma",
      }
    ],
    totalAmount: 6999,
    utr: "928371049281",
    status: "ENERGIZING",
    orderedAt: "01 Mar 2026",
    courierPartner: "BlueDart Express",
    trackingNumber: "BD-89210492IN",
  },
  {
    id: "shop-order-102",
    orderRef: "ESTORE-2026-412",
    buyerName: "Nganba Meitei",
    mobile: "+91 90123 45678",
    address: "Uripok, Imphal West, Manipur - 795001",
    pincode: "795001",
    items: [
      {
        productId: "prod-5",
        title: "Natural 5 Mukhi Nepal Rudraksha Mala (108+1 Beads)",
        price: 999,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=800&auto=format&fit=crop",
        sellerName: "KangleiAstro Store",
      }
    ],
    totalAmount: 999,
    utr: "881029481029",
    status: "DELIVERED",
    orderedAt: "24 Feb 2026",
    courierPartner: "Delhivery Surface",
    trackingNumber: "DEL-481920492",
  }
];

const KUNDLI_PROFILES = [
  { name: "Nganba Meitei", dob: "15 May 1995", tob: "10:30 AM", place: "Imphal West, Manipur" },
  { name: "Thoibi Ningthoujam", dob: "12 Apr 1996", tob: "08:30 AM", place: "Imphal East, Manipur" },
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
  const [newDeliveryAddrInput, setNewDeliveryAddrInput] = useState('');
  const [showNewAddrInput, setShowNewAddrInput] = useState(false);

  // Dashboard Tabs & E-Store Orders State
  const [activeDashTab, setActiveDashTab] = useState<'consultations' | 'store_orders' | 'live_consultations'>('consultations');
  const [activeLiveSessionId, setActiveLiveSessionId] = useState<string | null>(null);
  const [clientSessions, setClientSessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const res = await fetch('/api/consultations');
        const data = await res.json();
        if (data.sessions && Array.isArray(data.sessions)) {
          setClientSessions(data.sessions);
          const live = data.sessions.find((s: any) => s.status === 'LIVE' || s.status === 'WAITING');
          if (live && !activeLiveSessionId) {
            setActiveLiveSessionId(live.id);
          }
        }
      } catch (err) {
        console.warn('Client consultation poll note:', err);
      }
    };
    fetchConsultations();
    const interval = setInterval(fetchConsultations, 3000);
    return () => clearInterval(interval);
  }, [activeLiveSessionId]);

  const [shopOrders, setShopOrders] = useState<ShopOrder[]>(DEFAULT_SHOP_ORDERS);
  const [storeFilterStatus, setStoreFilterStatus] = useState<string>('ALL');

  // Cancellation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCancelOrder, setSelectedCancelOrder] = useState<ShopOrder | null>(null);
  const [cancelReason, setCancelReason] = useState('Changed my mind / Ordered by mistake');
  const [cancelNotes, setCancelNotes] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  // Invoice Receipt Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<ShopOrder | null>(null);

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

  // Fetch live orders from /api/kuthi with real-time polling so admin status updates appear instantly
  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/kuthi');
        const data = await res.json();
        if (isMounted && data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Error fetching client orders:', err);
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Fetch live store orders from /api/shop with real-time polling
  useEffect(() => {
    let isMounted = true;
    const fetchShopOrders = async () => {
      try {
        const res = await fetch('/api/shop');
        const data = await res.json();
        if (isMounted && data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
          setShopOrders(data.orders);
        }
      } catch (err) {
        console.error('Error fetching shop orders:', err);
      }
    };

    fetchShopOrders();
    const interval = setInterval(fetchShopOrders, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleCancelOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCancelOrder) return;

    setCancelLoading(true);
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CANCEL_ORDER',
          id: selectedCancelOrder.id,
          reason: `${cancelReason}${cancelNotes ? ` - ${cancelNotes}` : ''}`,
        }),
      });
      const data = await res.json();
      setCancelLoading(false);

      if (data.success) {
        setShopOrders((prev) =>
          prev.map((o) =>
            o.id === selectedCancelOrder.id
              ? { ...o, status: 'CANCELLED', cancelReason: `${cancelReason}${cancelNotes ? ` - ${cancelNotes}` : ''}` }
              : o
          )
        );
        setShowCancelModal(false);
        setSelectedCancelOrder(null);
      }
    } catch (err) {
      setCancelLoading(false);
    }
  };

  const completedCount = orders.filter(o => o.status === 'COMPLETED' || o.status === 'REPORT_RECEIVED' || o.reportFileName).length;
  const totalSpent = orders.reduce((acc, o) => acc + (o.amount || 499), 0);

  const STATS = [
    { label: "Total Orders", value: orders.length ? String(orders.length) : "3", icon: ShoppingBag, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Active Consultations", value: String(Math.max(0, orders.length - completedCount)), icon: Activity, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Reports Ready / Downloaded", value: String(completedCount || 2), icon: FileDown, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, icon: CreditCard, color: "text-purple-600", bg: "bg-purple-100" }
  ];

  return (
    <div className="min-h-screen bg-[#fffdfa] pt-4 sm:pt-6 pb-16 font-sans text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#b45309]">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {userProfile.name || 'Client'}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/profile" className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-[#b45309] font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xs">
              <UserCircle className="w-4 h-4 text-[#d97706]" />
              My Profile
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

        {/* Dashboard Section Switcher Tabs */}
        <div className="flex border-b border-[#f3e8d2] mb-6 gap-2 flex-wrap">
          <button
            onClick={() => setActiveDashTab('live_consultations')}
            className={`px-5 py-3 font-extrabold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeDashTab === 'live_consultations'
                ? 'border-[#d97706] text-[#b45309] bg-[#fef3c7]/50 rounded-t-2xl'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Phone className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Live Chat & Call Room ({clientSessions.length})</span>
            {activeLiveSessionId && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold animate-pulse">
                ACTIVE
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveDashTab('consultations')}
            className={`px-5 py-3 font-extrabold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeDashTab === 'consultations'
                ? 'border-[#d97706] text-[#b45309] bg-[#fef3c7]/50 rounded-t-2xl'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Clock className="w-4 h-4 text-[#d97706]" />
            <span>Kuthi Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveDashTab('store_orders')}
            className={`px-5 py-3 font-extrabold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeDashTab === 'store_orders'
                ? 'border-[#d97706] text-[#b45309] bg-[#fef3c7]/50 rounded-t-2xl'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#d97706]" />
            <span>E-Store Orders & Item Deliveries ({shopOrders.length})</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="w-full lg:w-2/3 space-y-8">

            {/* ================= TAB 0: LIVE CONSULTATIONS ================= */}
            {activeDashTab === 'live_consultations' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-[#f3e8d2] shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#f3e8d2] pb-4">
                    <div>
                      <h2 className="text-xl font-serif font-bold flex items-center gap-2 text-[#0f172a]">
                        <Phone className="w-5 h-5 text-emerald-600 animate-pulse" />
                        My In-App Live Consultations
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Access your ongoing 1-on-1 live chat and voice call sessions with empaneled astrologers.
                      </p>
                    </div>
                  </div>

                  {activeLiveSessionId ? (
                    <LiveConsultationRoom
                      sessionId={activeLiveSessionId}
                      currentUserType="CLIENT"
                      onClose={() => setActiveLiveSessionId(null)}
                    />
                  ) : (
                    <div className="text-center py-10 px-4 border-2 border-dashed border-[#f3e8d2] rounded-2xl bg-amber-50/20 space-y-3">
                      <MessageSquare className="w-10 h-10 text-[#d97706]/50 mx-auto" />
                      <h4 className="font-serif font-bold text-base text-[#0f172a]">No Active Live Consultation Session</h4>
                      <p className="text-xs text-gray-500 max-w-md mx-auto">
                        You can book a live 1-on-1 chat or voice call with Manipur&apos;s top-rated astrologers from the Astrologers Directory.
                      </p>
                      <Link
                        href="/astrologers"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Consult Top Astrologers Now</span>
                      </Link>
                    </div>
                  )}

                  {/* Live & Booked Consultations List with Real-time Status */}
                  {clientSessions.length > 0 && (
                    <div className="pt-4 border-t border-[#f3e8d2] space-y-3">
                      <h3 className="font-serif font-bold text-sm text-[#0f172a] flex items-center justify-between">
                        <span>My Consultation Sessions & Bookings</span>
                        <span className="text-xs text-gray-500 font-mono font-normal">
                          {clientSessions.length} total
                        </span>
                      </h3>
                      <div className="space-y-3">
                        {clientSessions.map((sess) => {
                          const isPendingVerification = sess.paymentStatus === 'PENDING_VERIFICATION';
                          const isVerified = sess.paymentStatus === 'VERIFIED' || sess.status === 'CONFIRMED';
                          const isLive = sess.status === 'LIVE';
                          const isCompleted = sess.status === 'COMPLETED';
                          const rawLink = sess.meetingLink || `/consultation?sessionId=${sess.id}`;
                          const roomLink = rawLink.includes('role=') ? rawLink : `${rawLink}${rawLink.includes('?') ? '&' : '?'}role=client`;

                          return (
                            <div key={sess.id} className="p-4 rounded-2xl bg-white border border-[#f3e8d2] shadow-xs space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-[#b45309] font-bold flex items-center justify-center shrink-0">
                                    {sess.astrologerName?.charAt(0) || 'A'}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-[#0f172a] text-sm">{sess.astrologerName}</h4>
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#fef3c7] text-[#b45309]">
                                        {sess.mode === 'CHAT' ? '💬 Chat' : '📞 Call'}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 font-mono">
                                      Ref: {sess.orderRef || sess.id} · Total: ₹{sess.totalFee}
                                    </p>
                                  </div>
                                </div>

                                {/* Shift Badge - Morning or Evening */}
                                <div className="text-right">
                                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${
                                    sess.shift === 'Evening'
                                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                                  }`}>
                                    <span>{sess.shift === 'Evening' ? '🌙' : '☀️'}</span>
                                    <span>{sess.shift || 'Morning'} Shift</span>
                                  </span>
                                  <div className="text-[11px] text-gray-500 mt-0.5 font-medium">
                                    {sess.scheduledDate || 'Today'}
                                  </div>
                                </div>
                              </div>

                              {/* Status & Meeting Link Bar */}
                              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500 font-medium">Order Status:</span>
                                  {isCompleted ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[11px] flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                                      <span>Session Completed</span>
                                    </span>
                                  ) : isLive ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center gap-1 animate-pulse">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                      <span>Live In Progress</span>
                                    </span>
                                  ) : isVerified ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Payment Verified by Admin</span>
                                    </span>
                                  ) : sess.paymentStatus === 'REJECTED' ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-extrabold text-[11px] flex items-center gap-1">
                                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                                      <span>Payment Rejected / Invalid UTR</span>
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[11px] flex items-center gap-1 animate-pulse">
                                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                                      <span>Awaiting Admin Payment Verification</span>
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* Action Buttons */}
                                  {isVerified || isLive ? (
                                    <a
                                      href={roomLink}
                                      className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                                    >
                                      <span>Join Consultation Room</span>
                                      <Sparkles className="w-3.5 h-3.5" />
                                    </a>
                                  ) : (
                                    <span className="text-[11px] text-gray-500 font-mono">
                                      UTR: {sess.paymentUtr || 'Verification Pending'}
                                    </span>
                                  )}

                                  <button
                                    onClick={() => {
                                      setActiveLiveSessionId(sess.id);
                                    }}
                                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition cursor-pointer"
                                  >
                                    Open Workspace
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* ================= TAB 1: CONSULTATION ORDERS ================= */}
            {activeDashTab === 'consultations' && (
              <>
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
                              <td className="p-4 whitespace-nowrap space-y-1">
                                <div>{getStatusBadge(order.status)}</div>
                                <div>
                                  {order.paymentStatus === 'PAYMENT_RECEIVED' ? (
                                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 block">
                                      🟢 Payment Received & Verified
                                    </span>
                                  ) : order.paymentStatus === 'PAYMENT_NOT_RECEIVED' ? (
                                    <span className="text-[10px] font-extrabold text-red-800 bg-red-100 px-2 py-0.5 rounded border border-red-200 block">
                                      🔴 Payment Not Received (Failed)
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 block animate-pulse">
                                      🟡 Verifying UTR Transaction...
                                    </span>
                                  )}
                                </div>
                              </td>
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
                    {(() => {
                      const guruReports = orders.filter(o => o.status === 'COMPLETED' || o.status === 'REPORT_RECEIVED' || o.reportFileName);
                      if (guruReports.length === 0) {
                        return (
                          <div className="text-center py-8 px-4 border-2 border-dashed border-[#f3e8d2] rounded-2xl bg-amber-50/20">
                            <FileText className="w-10 h-10 text-[#d97706]/50 mx-auto mb-2" />
                            <h4 className="font-serif font-bold text-sm text-[#0f172a]">No Astrologer Reports Uploaded Yet</h4>
                            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                              Once your assigned Master Astrologer or Guru completes your consultation and uploads your PDF report, JPEG chart scan, or Video reading, it will appear here for instant viewing & download.
                            </p>
                          </div>
                        );
                      }

                      return guruReports.map((order) => {
                        const fileStr = ((order.reportFileName || '') + (order.reportFileUrl || '')).toLowerCase();
                        const isVideo = fileStr.match(/\.(mp4|webm|mov|m4v|avi)$/) || fileStr.includes('video') || fileStr.includes('recording');
                        const isImage = fileStr.match(/\.(jpg|jpeg|png|webp|gif)$/) || fileStr.includes('image') || fileStr.includes('photo') || fileStr.includes('chart') || fileStr.includes('scan');

                        const formatBadge = isVideo ? (
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider inline-flex items-center gap-1">
                            <Video className="w-3 h-3" /> Video Reading
                          </span>
                        ) : isImage ? (
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-wider inline-flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> JPEG / Image Chart
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider inline-flex items-center gap-1">
                            <FileText className="w-3 h-3" /> PDF Document
                          </span>
                        );

                        const btnGradient = isVideo
                          ? 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
                          : isImage
                          ? 'from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                          : 'from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500';

                        const btnText = isVideo ? 'Play / Download Video' : isImage ? 'View / Download Image' : 'Download PDF';
                        const fileUrl = order.reportFileUrl || '/sample_kuthi_report.pdf';

                        return (
                          <div key={order.id} className="p-4 border border-[#f3e8d2] rounded-2xl bg-white hover:bg-amber-50/20 transition-all space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-start gap-3.5">
                                <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${
                                  isVideo ? 'bg-blue-100 text-blue-700' : isImage ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                  {isVideo ? <Video className="w-6 h-6" /> : isImage ? <ImageIcon className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-bold text-gray-900 text-sm">{order.reportFileName || `${order.serviceType} Report (${order.clientName})`}</h3>
                                    {formatBadge}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    Uploaded by Guru: <strong className="text-gray-700">{order.reportUploadedBy || order.assignedAstrologerName || 'Acharya Tombi Sharma'}</strong> • Order {order.orderRef}
                                  </p>
                                  {order.reportNotes && (
                                    <p className="text-xs text-gray-600 italic mt-1.5 bg-[#fefcf6] p-2.5 rounded-xl border border-[#f3e8d2]">
                                      &ldquo;{order.reportNotes}&rdquo;
                                    </p>
                                  )}
                                </div>
                              </div>

                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className={`shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r ${btnGradient} text-white text-xs font-extrabold rounded-xl transition-all shadow-xs`}
                              >
                                <Download className="w-4 h-4" />
                                <span>{btnText}</span>
                              </a>
                            </div>

                            {/* Embedded Video Player if Video */}
                            {isVideo && order.reportFileUrl && (
                              <div className="pt-2 border-t border-gray-100">
                                <video controls src={order.reportFileUrl} className="w-full max-h-64 rounded-xl bg-black border border-gray-200" />
                              </div>
                            )}

                            {/* Embedded Image Preview if Image */}
                            {isImage && order.reportFileUrl && (
                              <div className="pt-2 border-t border-gray-100">
                                <a href={order.reportFileUrl} target="_blank" rel="noopener noreferrer" className="block max-w-xs">
                                  <img src={order.reportFileUrl} alt="Astrologer Chart Scan" className="w-full h-36 object-cover rounded-xl border border-gray-200 hover:opacity-90 transition-opacity" />
                                  <span className="text-[10px] text-purple-700 font-bold mt-1 block">Click image to expand full resolution →</span>
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </motion.div>
              </>
            )}

            {/* ================= TAB 2: E-STORE ORDERS & DELIVERIES ================= */}
            {activeDashTab === 'store_orders' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  {['ALL', 'ACTIVE', 'DELIVERED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStoreFilterStatus(st)}
                      className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        storeFilterStatus === st
                          ? 'bg-[#d97706] text-white shadow-xs'
                          : 'bg-white border border-[#f3e8d2] text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {st === 'ALL' ? 'All E-Store Orders' : st}
                    </button>
                  ))}
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                  {shopOrders
                    .filter((so) => {
                      if (storeFilterStatus === 'ACTIVE') return so.status === 'PAID' || so.status === 'ENERGIZING' || so.status === 'DISPATCHED';
                      if (storeFilterStatus === 'DELIVERED') return so.status === 'DELIVERED';
                      if (storeFilterStatus === 'CANCELLED') return so.status === 'CANCELLED';
                      return true;
                    })
                    .map((sOrder) => {
                      const isCancelled = sOrder.status === 'CANCELLED';
                      const isDelivered = sOrder.status === 'DELIVERED';
                      const isDispatched = sOrder.status === 'DISPATCHED';
                      const isEnergizing = sOrder.status === 'ENERGIZING';

                      // Progress Tracker Step Number (1 to 4)
                      let currentStep = 1;
                      if (isEnergizing) currentStep = 2;
                      if (isDispatched) currentStep = 3;
                      if (isDelivered) currentStep = 4;

                      return (
                        <div
                          key={sOrder.id}
                          className="bg-white rounded-3xl border border-[#f3e8d2] shadow-sm p-6 space-y-5 relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

                          {/* Top Header Card */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f3e8d2]">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-extrabold text-sm text-[#b45309]">
                                  {sOrder.orderRef}
                                </span>
                                <span className="text-xs text-gray-500 font-medium">• Ordered on {sOrder.orderedAt}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-xs text-gray-600">Payment Ref (UTR): <strong className="font-mono text-gray-800">{sOrder.utr}</strong></span>
                                <span className="text-gray-300">•</span>
                                {sOrder.paymentStatus === 'PAYMENT_RECEIVED' ? (
                                  <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300 inline-flex items-center gap-1">
                                    🟢 Payment Received & Verified
                                  </span>
                                ) : sOrder.paymentStatus === 'PAYMENT_NOT_RECEIVED' ? (
                                  <span className="px-2.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-extrabold border border-red-300 inline-flex items-center gap-1">
                                    🔴 Payment Not Received (Failed)
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-300 inline-flex items-center gap-1 animate-pulse">
                                    🟡 Verifying UTR Transaction...
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {isCancelled ? (
                                <span className="px-3.5 py-1.5 rounded-full bg-red-100 text-red-800 font-extrabold text-xs flex items-center gap-1.5">
                                  <Ban className="w-3.5 h-3.5" /> CANCELLED
                                </span>
                              ) : isDelivered ? (
                                <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> DELIVERED
                                </span>
                              ) : isDispatched ? (
                                <span className="px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center gap-1.5">
                                  <Truck className="w-3.5 h-3.5" /> IN TRANSIT / DISPATCHED
                                </span>
                              ) : isEnergizing ? (
                                <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center gap-1.5 animate-pulse">
                                  <Sparkles className="w-3.5 h-3.5 text-[#d97706]" /> VEDIC CONSECRATION
                                </span>
                              ) : (
                                <span className="px-3.5 py-1.5 rounded-full bg-green-100 text-green-800 font-extrabold text-xs">
                                  ORDER CONFIRMED
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Progress Step Bar (If not cancelled) */}
                          {!isCancelled && (
                            <div className="bg-[#fefcf6] p-4 rounded-2xl border border-[#f3e8d2] space-y-2">
                              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                Order Delivery Tracker
                              </div>
                              <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
                                <div className={`py-2 px-1 rounded-xl ${currentStep >= 1 ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                  1. Order Placed
                                </div>
                                <div className={`py-2 px-1 rounded-xl ${currentStep >= 2 ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                  2. Consecration
                                </div>
                                <div className={`py-2 px-1 rounded-xl ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                  3. Dispatched
                                </div>
                                <div className={`py-2 px-1 rounded-xl ${currentStep >= 4 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                  4. Delivered
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Cancellation Note if Cancelled */}
                          {isCancelled && (
                            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                              <div>
                                <strong className="font-bold block">Order Cancelled</strong>
                                <span>Reason: {sOrder.cancelReason || 'Requested by customer'}</span>
                              </div>
                            </div>
                          )}

                          {/* Items Grid */}
                          <div className="space-y-3">
                            {sOrder.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl border border-[#f3e8d2] bg-[#fffdfa]">
                                <div className="flex items-center gap-3.5">
                                  {item.image && (
                                    <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl border border-gray-200 shrink-0" />
                                  )}
                                  <div>
                                    <h4 className="font-serif font-bold text-sm text-[#0f172a]">{item.title}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      Qty: <strong className="text-gray-800">{item.quantity}</strong> • Price: <strong className="text-[#b45309]">₹{item.price.toLocaleString()}</strong>
                                      {item.sellerName && (
                                        <span className="block text-[11px] text-gray-400 mt-0.5">Provided by: {item.sellerName}</span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="font-serif font-bold text-base text-[#0f172a] shrink-0">
                                  ₹{(item.price * item.quantity).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Logistics & Delivery Address */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#f8fafc] p-3.5 rounded-2xl border border-gray-200">
                            <div>
                              <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block">Shipping Address</span>
                              <p className="text-gray-800 font-medium mt-0.5 leading-snug">{sOrder.address}</p>
                            </div>
                            <div>
                              <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block">Courier & Logistics Tracking</span>
                              {sOrder.trackingNumber ? (
                                <p className="text-gray-800 font-medium mt-0.5">
                                  {sOrder.courierPartner || 'Express Logistics'} • AWB: <strong className="font-mono text-[#b45309]">{sOrder.trackingNumber}</strong>
                                </p>
                              ) : (
                                <p className="text-gray-500 italic mt-0.5">Tracking details will update once dispatched</p>
                              )}
                            </div>
                          </div>

                          {/* Action Footer Buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#f3e8d2]">
                            <div className="flex items-center gap-2">
                              {/* Request Cancellation Button */}
                              {!isCancelled && !isDelivered && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCancelOrder(sOrder);
                                    setShowCancelModal(true);
                                  }}
                                  className="px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Request Cancellation</span>
                                </button>
                              )}

                              {/* Download Invoice / Receipt Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedInvoiceOrder(sOrder);
                                  setShowInvoiceModal(true);
                                }}
                                className="px-4 py-2.5 rounded-xl border border-[#f3e8d2] bg-gray-50 hover:bg-amber-50 text-gray-800 hover:text-[#b45309] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5 text-[#d97706]" />
                                <span>Download Invoice</span>
                              </button>
                            </div>

                            <a
                              href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi KangleiAstro Team, I have a question regarding my E-Store Order ${sOrder.orderRef}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Support Help</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </motion.div>
            )}

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
                <Link
                  href="/profile"
                  className="w-full py-2.5 bg-gradient-to-r from-[#b45309] to-[#d97706] text-white hover:opacity-95 rounded-xl text-xs font-extrabold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UserCircle className="w-4 h-4" />
                  <span>Manage Profile & Delivery Addresses →</span>
                </Link>
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
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#f3e8d2] shadow-2xl p-6 space-y-4 z-10 text-xs text-[#0f172a] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#f3e8d2]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#b45309] flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-[#d97706]" />
                  Edit Profile & Contact Details
                </h3>
                <p className="text-gray-500 text-[11px]">Update your name, mobile, email, residential & delivery address</p>
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

            <form onSubmit={handleSaveProfile} className="space-y-3.5 font-sans">
              <div>
                <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name || ''}
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
                  value={editForm.email || ''}
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
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value, whatsapp: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#f3e8d2] bg-[#fffdfa] text-gray-900 font-semibold focus:border-[#d97706] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Gender / Sex
                  </label>
                  <select
                    value={editForm.sex || 'Male'}
                    onChange={(e) => setEditForm({ ...editForm, sex: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#f3e8d2] bg-[#fffdfa] text-gray-900 font-semibold focus:border-[#d97706] focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Residential Address */}
              <div>
                <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Residential Address<span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#f3e8d2] bg-[#fffdfa] text-gray-900 font-medium focus:border-[#d97706] focus:outline-none"
                  placeholder="Enter street, city, state & pincode"
                />
              </div>

              {/* Delivery Address Toggle */}
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

              {/* Separate Primary Delivery Address (if sameAsResident is false) */}
              {editForm.sameAsResident === false && (
                <div className="animate-fadeIn">
                  <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Primary Delivery Address<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required={editForm.sameAsResident === false}
                    value={editForm.deliveryAddress || ''}
                    onChange={(e) => setEditForm({ ...editForm, deliveryAddress: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#f3e8d2] bg-[#fffdfa] text-gray-900 font-medium focus:border-[#d97706] focus:outline-none"
                    placeholder="Enter separate shipping / delivery address"
                  />
                </div>
              )}

              {/* Multiple Delivery Addresses List & Add More Option */}
              <div className="pt-2 border-t border-[#f3e8d2] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                    Saved Delivery Addresses ({editForm.deliveryAddresses?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewAddrInput(!showNewAddrInput)}
                    className="text-xs font-bold text-[#b45309] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add More Delivery Address</span>
                  </button>
                </div>

                {/* Saved list */}
                {editForm.deliveryAddresses && editForm.deliveryAddresses.length > 0 && (
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {editForm.deliveryAddresses.map((addr: string, idx: number) => (
                      <div key={idx} className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#d97706] mt-0.5 shrink-0" />
                          <span className="text-gray-800 font-medium leading-snug">{addr}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editForm.deliveryAddresses.filter((_: any, i: number) => i !== idx);
                            setEditForm({ ...editForm, deliveryAddresses: updated });
                          }}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer shrink-0"
                          title="Remove Address"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Delivery Address Field */}
                {showNewAddrInput && (
                  <div className="flex items-center gap-2 pt-1 animate-fadeIn">
                    <input
                      type="text"
                      placeholder="e.g. Office: Plot 12, MG Road, Imphal West - 795001"
                      value={newDeliveryAddrInput}
                      onChange={(e) => setNewDeliveryAddrInput(e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-[#f3e8d2] bg-white text-xs font-medium focus:border-[#d97706] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newDeliveryAddrInput.trim()) {
                          const existing = editForm.deliveryAddresses || [];
                          setEditForm({
                            ...editForm,
                            deliveryAddresses: [...existing, newDeliveryAddrInput.trim()],
                          });
                          setNewDeliveryAddrInput('');
                          setShowNewAddrInput(false);
                        }
                      }}
                      className="px-3 py-2 bg-[#d97706] hover:bg-[#b45309] text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                )}
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

      {/* REQUEST CANCELLATION MODAL */}
      {showCancelModal && selectedCancelOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#f3e8d2] shadow-2xl p-6 sm:p-8 space-y-5 text-xs text-[#0f172a]">
            <div className="flex justify-between items-center pb-3 border-b border-[#f3e8d2]">
              <div>
                <h3 className="font-serif font-bold text-lg text-red-700 flex items-center gap-2">
                  <Ban className="w-5 h-5 text-red-600" />
                  Request Order Cancellation
                </h3>
                <p className="text-gray-500 text-xs">Order Ref: <strong className="font-mono text-gray-800">{selectedCancelOrder.orderRef}</strong></p>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-1">
              <div className="font-extrabold flex items-center gap-1.5 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-[#d97706]" />
                Cancellation Notice
              </div>
              <p>Are you sure you want to cancel this order? If your item is already consecrated or dispatched, your request will be reviewed by support instantly.</p>
            </div>

            <form onSubmit={handleCancelOrderSubmit} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block font-bold text-[#0f172a] mb-1.5 uppercase tracking-wider text-[11px]">
                  Reason for Cancellation<span className="text-red-500">*</span>
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-bold text-[#0f172a] focus:border-[#d97706] focus:outline-none"
                >
                  <option value="Changed my mind / Ordered by mistake">Changed my mind / Ordered by mistake</option>
                  <option value="Want to change shipping address or items">Want to change shipping address or items</option>
                  <option value="Delivery time is longer than expected">Delivery time is longer than expected</option>
                  <option value="Found better alternative price">Found better alternative price</option>
                  <option value="Other reason">Other reason</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0f172a] mb-1.5 uppercase tracking-wider text-[11px]">
                  Additional Details / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={cancelNotes}
                  onChange={(e) => setCancelNotes(e.target.value)}
                  placeholder="Please describe reason for cancellation..."
                  className="w-full p-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#f3e8d2]">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 cursor-pointer"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={cancelLoading}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Ban className="w-4 h-4" />
                  <span>{cancelLoading ? 'Cancelling...' : 'Confirm Order Cancellation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* E-STORE INVOICE / RECEIPT MODAL */}
      {showInvoiceModal && selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#f3e8d2] shadow-2xl p-6 sm:p-8 space-y-6 text-xs text-[#0f172a] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-gray-200">
              <div>
                <span className="font-serif font-black text-xl text-[#0f172a] block">KuthiYengpham E-Store</span>
                <span className="text-[10px] text-[#b45309] font-bold uppercase tracking-wider">Tax Invoice & Order Receipt</span>
              </div>
              <button onClick={() => setShowInvoiceModal(false)} className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-[#f8fafc] p-4 rounded-2xl border border-gray-200">
              <div>
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block">Order Details</span>
                <p className="font-mono font-bold text-[#b45309] mt-0.5">{selectedInvoiceOrder.orderRef}</p>
                <p className="text-gray-600 mt-0.5">Date: {selectedInvoiceOrder.orderedAt}</p>
                <p className="text-gray-600">UTR / Payment Ref: <strong className="font-mono text-gray-800">{selectedInvoiceOrder.utr}</strong></p>
              </div>
              <div>
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block">Customer & Shipping Address</span>
                <p className="font-bold text-gray-900 mt-0.5">{selectedInvoiceOrder.buyerName}</p>
                <p className="text-gray-600">{selectedInvoiceOrder.mobile}</p>
                <p className="text-gray-600 leading-snug">{selectedInvoiceOrder.address}</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-amber-50/60 border-b border-gray-200 text-[10px] uppercase font-bold text-gray-700">
                    <th className="p-3">Item Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {selectedInvoiceOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-semibold text-gray-900">{it.title}</td>
                      <td className="p-3 text-center font-mono">{it.quantity}</td>
                      <td className="p-3 text-right font-mono">₹{it.price.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold text-[#b45309]">₹{(it.price * it.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                Payment Status: FULLY PAID (100% Verified)
              </span>
              <div className="text-right">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Grand Total Paid</span>
                <span className="text-2xl font-serif font-extrabold text-[#0f172a]">₹{selectedInvoiceOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b45309] to-[#d97706] text-white font-extrabold text-xs shadow-md flex items-center gap-2 hover:opacity-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print / Save Invoice (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
