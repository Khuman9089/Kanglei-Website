'use client';

import React, { useState, useEffect } from 'react';
import { 
  Moon, LayoutDashboard, FileText, QrCode, Users, Settings, 
  Search, Bell, Plus, CheckCircle2, XCircle, ArrowUpRight, 
  ArrowDownRight, MessageSquare, ExternalLink, ShieldCheck, Lock,
  TrendingUp, BarChart2, Calendar, Clock, LogOut, Check, ChevronDown, Menu,
  DollarSign, Filter, Share2, UserCheck, Award, Eye, Download, Copy, X, Sparkles, Save, Tag,
  BookOpen, FilePlus, Trash2, Edit, ShoppingBag, Package, Megaphone, Star, Truck, Upload, Sun, Image as ImageIcon,
  Headphones, Mail, Phone, Camera
} from 'lucide-react';
import Link from 'next/link';
import { ACTIVE_TOOLS_REGISTRY } from '@/config/toolsRegistry';

interface Astrologer {
  id: string;
  name: string;
  avatar?: string;
  username?: string;
  specialty: string;
  phone: string;
  whatsappNo: string;
  sameAsWhatsapp?: boolean;
  email?: string;
  streetLane?: string;
  cityDistrict?: string;
  state?: string;
  pincode?: string;
  address?: string;
  experienceYears?: number;
  languages?: string[];
  password?: string;
  status?: 'ACTIVE' | 'ON_HOLD' | 'SUSPENDED';
  upiId?: string;
  bankName?: string;
  accountHolder?: string;
  accountNo?: string;
  ifscCode?: string;
  payoutMethod?: 'UPI' | 'BANK';
  planTier?: 'BASIC' | 'ADVANCE' | 'PRO';
  completedCount: number;
  pendingPayout: number;
  totalEarnings?: number;
  totalPaidOut?: number;
  payoutStatus?: 'REQUESTED' | 'SETTLED' | 'IDLE';
  payoutRequestedAmount?: number;
  lastPayoutUtr?: string;
  lastPayoutDate?: string;
  allowedTools?: string[];
  showOnHome?: boolean;
}

interface SubServiceItem {
  id: string;
  title: string;
  price: number;
  description?: string;
}

interface ManagedService {
  id: string;
  badge: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  astroPayoutFee: number;
  cta: string;
  link?: string;
  pageTarget?: '/manipuri_kuthi_yengba' | '/manipuri_kuthi' | '/numit_leppa_yengba' | '/matching' | 'all';
  active: boolean;
  subServices?: SubServiceItem[];
}

interface ProductItem {
  id: string;
  sku?: string;
  title: string;
  category: string;
  rulingPlanet?: string;
  zodiacRashi?: string;
  caratWeight?: number;
  rattiWeight?: number;
  origin?: string;
  color?: string;
  cutShape?: string;
  treatment?: string;
  certification?: string;
  recommendedMetal?: string;
  wearingFinger?: string;
  wearingDayTime?: string;
  vedicMantra?: string;
  shortDescription?: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number;
  image: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  features?: string[];
  sellerType?: 'PLATFORM' | 'ASTROLOGER';
  sellerId?: string;
  sellerName?: string;
  status?: 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED';
  adminCommissionPct?: number;
  isFeatured?: boolean;
}

interface ShopOrder {
  id: string;
  orderRef: string;
  buyerName: string;
  mobile: string;
  whatsappNo: string;
  address: string;
  pincode: string;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    sellerType?: 'PLATFORM' | 'ASTROLOGER';
    sellerId?: string;
    sellerName?: string;
    adminCommissionPct?: number;
    adminCommissionAmount?: number;
    astroPayoutAmount?: number;
  }[];
  subtotalAmount?: number;
  discountAmount?: number;
  couponCode?: string;
  shippingFee?: number;
  totalAmount: number;
  utr: string;
  status: 'PAYMENT_PENDING' | 'PAID' | 'ENERGIZING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus?: 'PAYMENT_RECEIVED' | 'PAYMENT_NOT_RECEIVED' | 'VERIFICATION_PENDING';
  adminConfirmed?: boolean;
  orderedAt: string;
  courierPartner?: string;
  trackingNumber?: string;
  deliveryAgentPhone?: string;
  expectedDeliveryDate?: string;
  dispatchedAt?: string;
}

interface CouponItem {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FLAT' | 'FREE_SHIPPING';
  value: number;
  minOrderAmount: number;
  active: boolean;
  expiryDate?: string;
  usageCount: number;
}

interface ShopSliderItem {
  id: string;
  badge: string;
  title: string;
  highlightText: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  bgColor?: string;
  active: boolean;
  displayOrder: number;
  price?: string;
  originalPrice?: string;
  rating?: number;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  author: string;
  authorRole?: string;
  readTime: string;
  publishedAt: string;
  views: number;
  likes: number;
  status: 'PUBLISHED' | 'DRAFT';
}

interface KuthiOrder {
  id: string;
  orderRef: string;
  clientName: string;
  sex: string;
  mobile: string;
  whatsappNo: string;
  email: string;
  kuthiAttached: boolean;
  kuthiFileName?: string;
  kuthiFileUrl?: string;
  dob?: string;
  tob?: string;
  pob?: string;
  groomDetails?: {
    name: string;
    dob: string;
    tob: string;
    pob: string;
    long?: string;
    lat?: string;
  };
  brideDetails?: {
    name: string;
    dob: string;
    tob: string;
    pob: string;
    long?: string;
    lat?: string;
  };
  question?: string;
  utr: string;
  submittedAt: string;
  amount: number;
  serviceType?: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_ANALYSIS' | 'REPORT_RECEIVED' | 'COMPLETED';
  paymentStatus?: 'PAYMENT_RECEIVED' | 'PAYMENT_NOT_RECEIVED' | 'VERIFICATION_PENDING';
  fatherName?: string;
  motherName?: string;
  yek?: string;
  gotra?: string;
  deliveryAddress?: string;
  category?: 'new_born_baby' | 'kuthi_rewrite';
  assignedAstrologerId?: string;
  assignedAstrologerName?: string;
  reportReceivedFromAstro?: boolean;
  reportFileName?: string;
  reportFileUrl?: string;
  reportUploadedAt?: string;
  reportUploadedBy?: string;
  reportNotes?: string;
}

const EMPANELED_ASTROLOGERS: Astrologer[] = [
  {
    id: 'astro-1',
    name: 'Acharya Tombi Sharma',
    username: 'tombi_guru',
    specialty: 'Vedic Horoscope & Kuthi Yengba Specialist',
    phone: '+91 98620 99881',
    whatsappNo: '+91 98620 99881',
    address: 'Uripok, Imphal West, Manipur',
    experienceYears: 15,
    completedCount: 142,
    pendingPayout: 3500,
    totalEarnings: 12750,
    totalPaidOut: 9250,
    payoutStatus: 'REQUESTED',
    payoutRequestedAmount: 3500,
    lastPayoutUtr: 'UPI-20268940129',
    lastPayoutDate: '2026-08-25',
  },
  {
    id: 'astro-2',
    name: 'Pandit Ningthem Meitei',
    username: 'ningthem_meitei',
    specialty: 'Marriage Compatibility & Dasha Remedies',
    phone: '+91 97740 33411',
    whatsappNo: '+91 97740 33411',
    address: 'Thoubal Mayai Leikai, Manipur',
    experienceYears: 12,
    completedCount: 98,
    pendingPayout: 2250,
    totalEarnings: 8450,
    totalPaidOut: 6200,
    payoutStatus: 'IDLE',
    payoutRequestedAmount: 0,
    lastPayoutUtr: 'UPI-20268940088',
    lastPayoutDate: '2026-08-20',
  },
  {
    id: 'astro-3',
    name: 'Guru Sanatomba',
    username: 'sanatomba_guru',
    specialty: 'Navamsha D9 Chart & Gemstone Analysis',
    phone: '+91 98561 77122',
    whatsappNo: '+91 98561 77122',
    address: 'Bishnupur Bazar, Manipur',
    experienceYears: 18,
    completedCount: 64,
    pendingPayout: 1750,
    totalEarnings: 5950,
    totalPaidOut: 4200,
    payoutStatus: 'IDLE',
    payoutRequestedAmount: 0,
    lastPayoutUtr: 'UPI-20268939912',
    lastPayoutDate: '2026-08-18',
  },
];

const INITIAL_SERVICES: ManagedService[] = [
  {
    id: 's-1',
    badge: 'Popular',
    title: 'Kuthi Yengba (Horoscope Analysis & Remedies)',
    description: 'In-depth analysis of natal Kundali, Vimshottari Dasha, planetary transits, and customized Manipuri Vedic remedies.',
    features: [
      'D1 Rashi & D9 Navamsha chart analysis',
      'Favorable promotion & job change windows',
      'Personalized wealth accumulation remedies',
    ],
    price: '₹499',
    astroPayoutFee: 300,
    cta: 'Order Kuthi Yengba',
    link: '/manipuri_kuthi_yengba',
    pageTarget: '/manipuri_kuthi_yengba',
    active: true,
    subServices: [
      { id: 'sub-101', title: 'Standard Kuthi Yengba (Detailed Dasha & Remedies)', price: 499, description: 'Complete analysis delivered to your WhatsApp within 12 Hours.' },
      { id: 'sub-102', title: 'Express Fast-Track Kuthi Yengba (Delivered within 4 Hours)', price: 799, description: 'Priority queue processing delivered within 4 Hours.' },
      { id: 'sub-103', title: 'Comprehensive 5-Year Life Roadmap Kuthi Report', price: 1199, description: 'Full 5-year planetary transit timeline and personalized remedies PDF.' },
    ],
  },
  {
    id: 's-2',
    badge: 'Traditional',
    title: 'Kuthi Iba (Handwritten Kuthi Creation - কুঠি ইবা)',
    description: 'Authentic hand-written Kuthi birth scroll prepared on sacred parchment by experienced Vedic Acharyas.',
    features: [
      'Handwritten D1 Rashi & D9 Navamsha charts',
      'Consecrated with sacred Vedic Mantras',
      'Physical home delivery across Manipur & India',
    ],
    price: '₹899',
    astroPayoutFee: 550,
    cta: 'Order Kuthi Iba',
    link: '/manipuri_kuthi',
    pageTarget: '/manipuri_kuthi',
    active: true,
    subServices: [
      { id: 'sub-201', title: 'Standard Handwritten Kuthi Paper (Single Child)', price: 899, description: 'Traditional handwritten birth scroll on sacred parchment.' },
      { id: 'sub-202', title: 'Premium Gold-Stamped Traditional Kuthi Scroll', price: 1499, description: 'Deluxe gold-bordered scroll in protective sacred case.' },
    ],
  },
  {
    id: 's-3',
    badge: 'High Accuracy',
    title: 'Pakna Wainaba Yengba (Kundli Matching & 36-Gun Milan)',
    description: 'Complete 36-Gun Ashtakoot Milan, Manglik Dosh analysis, and mental/emotional compatibility assessment.',
    features: [
      '36-Points Ashtakoot breakdown',
      'Manglik Dosh cancellation check',
      'Favorable marriage timing windows',
    ],
    price: '₹1,299',
    astroPayoutFee: 779,
    cta: 'Check Compatibility',
    link: '/matching',
    pageTarget: '/matching',
    active: true,
    subServices: [
      { id: 'sub-301', title: '36-Gun Ashtakoot Match & Manglik Check', price: 1299, description: 'Detailed 36-point compatibility report for couple pair.' },
      { id: 'sub-302', title: 'Full D9 Navamsha Couple Compatibility & Remedial Report', price: 1999, description: 'Comprehensive marriage compatibility with specific remedial pujas.' },
    ],
  },
  {
    id: 's-4',
    badge: 'Best Value',
    title: '1-on-1 Live Master Consultation',
    description: 'Direct face-to-face video consultation with our Master Vedic Astrologer with instant remedial guidance.',
    features: [
      '60 Mins direct video/audio session',
      'Full 5-year Vimshottari Dasha forecast',
      'Recorded session & remedies PDF',
    ],
    price: '₹2,499',
    astroPayoutFee: 1499,
    cta: 'Book Consultation',
    link: '/manipuri_kuthi_yengba?service=s-4',
    pageTarget: '/manipuri_kuthi_yengba',
    active: true,
    subServices: [
      { id: 'sub-401', title: '30-Minute Video/Phone Session', price: 1499, description: 'Direct 30-minute consultation with Master Astrologer.' },
      { id: 'sub-402', title: '60-Minute Deep Consultation + Recorded Session & PDF Remedies', price: 2499, description: 'Full 60-minute session with recorded audio and written PDF remedies.' },
    ],
  },
  {
    id: 's-5',
    badge: 'Auspicious',
    title: 'Numit Leppa / Numit Yengba (Auspicious Muhurat Date)',
    description: 'Calculate auspicious dates & shubha muhurat for Yum Sangba, Luhongba, Swasti Puja, Business & Vehicle Purchase.',
    features: [
      'Auspicious Tithi, Nakshatra & Lagna timing',
      'Grahachar & planetary alignment for event',
      'Written Muhurat PDF guidance delivered to WhatsApp',
    ],
    price: '₹501',
    astroPayoutFee: 300,
    cta: 'Check Auspicious Date',
    link: '/numit_leppa_yengba',
    pageTarget: '/numit_leppa_yengba',
    active: true,
    subServices: [
      { id: 'sub-501', title: 'Yum Sangba (Housewarming Date)', price: 501, description: 'Auspicious muhurat & Griha Pravesh alignment' },
      { id: 'sub-502', title: 'Luhongba (Marriage & Wedding Date)', price: 751, description: 'Subha Vivaha muhurat & lagna calculations' },
      { id: 'sub-503', title: 'Swasti Puja & Naming (Child Naming)', price: 351, description: 'Nakshatra & auspicious naming date' },
      { id: 'sub-504', title: 'Business & Office Opening', price: 501, description: 'Shubh Labh & trade inauguration date' },
      { id: 'sub-505', title: 'Vehicle & Property Registration', price: 351, description: 'Auspicious vehicle delivery & land purchase' },
      { id: 'sub-506', title: 'General Numit Yengba (Auspicious Date)', price: 401, description: 'General travel, ritual, or important event' },
    ],
  },
];

const INITIAL_KUTHI_ORDERS: KuthiOrder[] = [
  {
    id: 'k-1',
    orderRef: 'KY-2026-8941',
    clientName: 'Nganba Meitei',
    sex: 'Male',
    mobile: '+91 98620 12345',
    whatsappNo: '+91 98620 12345',
    email: 'nganba@example.com',
    kuthiAttached: true,
    kuthiFileName: 'nganba_kuthi_paper.pdf',
    kuthiFileUrl: '/sample_kuthi.pdf',
    dob: '1995-05-15',
    tob: '10:30 AM',
    pob: 'Imphal West',
    question: 'Please check career prospects in 2026 and marriage compatibility.',
    utr: '429810394812',
    submittedAt: 'Today, 10:15 AM',
    amount: 499,
    status: 'PENDING',
  },
  {
    id: 'k-2',
    orderRef: 'KY-2026-8942',
    clientName: 'Thoibi Ningthoujam',
    sex: 'Female',
    mobile: '+91 98561 88210',
    whatsappNo: '+91 98561 88210',
    email: 'thoibi@example.com',
    kuthiAttached: false,
    dob: '1996-04-12',
    tob: '08:30 AM',
    pob: 'Imphal East',
    question: 'Asking about health remedies for Rahu Dasha.',
    utr: '429810441920',
    submittedAt: 'Today, 09:40 AM',
    amount: 499,
    status: 'ASSIGNED',
    assignedAstrologerId: 'astro-1',
    assignedAstrologerName: 'Acharya Tombi Sharma',
  },
  {
    id: 'k-3',
    orderRef: 'KY-2026-8939',
    clientName: 'Laishram Rajen',
    sex: 'Male',
    mobile: '+91 97740 55120',
    whatsappNo: '+91 97740 55120',
    email: 'rajen@example.com',
    kuthiAttached: true,
    kuthiFileName: 'rajen_kundali_scan.jpg',
    kuthiFileUrl: '/sample_kundali_scan.jpg',
    dob: '1992-11-20',
    tob: '05:45 PM',
    pob: 'Bishnupur',
    utr: '429809112830',
    submittedAt: 'Yesterday, 04:20 PM',
    amount: 499,
    status: 'COMPLETED',
    assignedAstrologerId: 'astro-2',
    assignedAstrologerName: 'Pandit Ningthem Meitei',
    reportReceivedFromAstro: true,
  },
];

interface CustomerReview {
  id: string;
  clientName: string;
  location: string;
  rating: number;
  comment: string;
  serviceName?: string;
  astrologerName?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerified: boolean;
  createdAt: string;
}

interface ClientUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsappNo: string;
  sex: 'Male' | 'Female' | 'Other';
  address: string;
  role: 'CLIENT';
  joinedAt: string;
  totalOrders: number;
  totalSpent: number;
  savedKundlisCount: number;
  status: 'ACTIVE' | 'VERIFIED' | 'SUSPENDED';
}

const INITIAL_CLIENT_BASE: ClientUser[] = [
  {
    id: 'client-1',
    name: 'Nganba Meitei',
    email: 'nganba@example.com',
    phone: '+91 98620 12345',
    whatsappNo: '+91 98620 12345',
    sex: 'Male',
    address: 'Uripok, Imphal West, Manipur',
    role: 'CLIENT',
    joinedAt: '2026-01-15',
    totalOrders: 3,
    totalSpent: 1497,
    savedKundlisCount: 4,
    status: 'VERIFIED',
  },
  {
    id: 'client-2',
    name: 'Thoibi Ningthoujam',
    email: 'thoibi.n@gmail.com',
    phone: '+91 97740 98765',
    whatsappNo: '+91 97740 98765',
    sex: 'Female',
    address: 'Thoubal Mayai Leikai, Manipur',
    role: 'CLIENT',
    joinedAt: '2026-02-02',
    totalOrders: 2,
    totalSpent: 998,
    savedKundlisCount: 2,
    status: 'VERIFIED',
  },
  {
    id: 'client-3',
    name: 'Ibomcha Singh',
    email: 'ibomcha.singh@yahoo.com',
    phone: '+91 98561 22334',
    whatsappNo: '+91 98561 22334',
    sex: 'Male',
    address: 'Bishnupur Bazar, Manipur',
    role: 'CLIENT',
    joinedAt: '2026-02-14',
    totalOrders: 1,
    totalSpent: 499,
    savedKundlisCount: 1,
    status: 'ACTIVE',
  },
  {
    id: 'client-4',
    name: 'Yaiphabi Devi',
    email: 'yaiphabi.devi@outlook.com',
    phone: '+91 88374 11223',
    whatsappNo: '+91 88374 11223',
    sex: 'Female',
    address: 'Porompat, Imphal East, Manipur',
    role: 'CLIENT',
    joinedAt: '2026-02-20',
    totalOrders: 4,
    totalSpent: 2496,
    savedKundlisCount: 5,
    status: 'VERIFIED',
  },
];

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminNewPasswordInput, setAdminNewPasswordInput] = useState('');
  const [adminPwdMsg, setAdminPwdMsg] = useState('');
  const [authError, setAuthError] = useState('');

  const handleUpdateAdminMasterPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPwdMsg('');
    if (adminNewPasswordInput.trim().length < 4) {
      setAdminPwdMsg('❌ Password must be at least 4 characters.');
      return;
    }

    try {
      await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CHANGE_PASSWORD',
          identifier: 'admin@kanglei',
          currentPassword: adminPasswordInput,
          newPassword: adminNewPasswordInput,
        }),
      });
    } catch (err) {
      console.warn(err);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('kanglei_admin_password', adminNewPasswordInput.trim());
    }
    setAdminPwdMsg('✅ Admin Master Password Updated & Secured Successfully!');
    setAdminPasswordInput('');
    setAdminNewPasswordInput('');
    setTimeout(() => setAdminPwdMsg(''), 3500);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuthed = localStorage.getItem('kanglei_admin_authed') === 'true';
      if (isAuthed) {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const customPwd = typeof window !== 'undefined' ? localStorage.getItem('kanglei_admin_password') : null;
    
    // If Admin updated password, ONLY accept their custom password!
    // Initial default initial password before first update is 'kanglei@Admin2026!' or 'admin123'
    const inputPwd = adminPasswordInput.trim();
    if (customPwd) {
      if (inputPwd === customPwd) {
        localStorage.setItem('kanglei_admin_authed', 'true');
        setIsAuthenticated(true);
        setAdminPasswordInput('');
      } else {
        setAuthError('❌ Access Denied: Incorrect Admin Master Password!');
      }
    } else {
      if (inputPwd === 'kanglei@Admin2026!' || inputPwd === 'admin123' || inputPwd === 'admin') {
        localStorage.setItem('kanglei_admin_authed', 'true');
        setIsAuthenticated(true);
        setAdminPasswordInput('');
      } else {
        setAuthError('❌ Access Denied: Incorrect Admin Master Password!');
      }
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('kanglei_admin_authed');
    setIsAuthenticated(false);
  };

  const [activeTab, setActiveTab] = useState<'dashboard' | 'kuthi' | 'blog' | 'shop' | 'shop_orders' | 'shop_products' | 'shop_astro_products' | 'shop_delivery' | 'shop_coupons' | 'shop_sliders' | 'announcements' | 'astrologers' | 'add_astro' | 'astro_profile' | 'astro_payouts' | 'astro_assign_list' | 'astro_website' | 'astro_services' | 'astro_rates' | 'upi' | 'clients' | 'banner' | 'ticker' | 'reviews' | 'navbar' | 'settings'>('dashboard');

  const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer | null>(null);
  const [showPasswordUpdateModal, setShowPasswordUpdateModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const [shopCoupons, setShopCoupons] = useState<CouponItem[]>([]);
  const [editingCoupon, setEditingCoupon] = useState<Partial<CouponItem> | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const [shopSliders, setShopSliders] = useState<ShopSliderItem[]>([]);
  const [editingSlider, setEditingSlider] = useState<Partial<ShopSliderItem> | null>(null);
  const [showSliderModal, setShowSliderModal] = useState(false);

  // Site Settings & Payment UPI QR State
  const [siteSettings, setSiteSettings] = useState({
    headerSettings: {
      supportTiming: 'Live Support (9:30 AM – 6:00 PM IST)',
      supportEmail: 'ccare@kangleiastro.com',
      supportPhone: '+91 98765 43210',
    },
    upiSettings: {
      upiId: 'kangleiastro@upi',
      payeeName: 'KangleiAstro Services',
      qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=kangleiastro@upi&pn=KangleiAstro%20Services',
      qrNotes: 'Scan with GPay, PhonePe, Paytm, BHIM or any UPI app',
    },
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.headerSettings || data.upiSettings) {
          setSiteSettings((prev) => ({
            headerSettings: { ...prev.headerSettings, ...(data.headerSettings || {}) },
            upiSettings: { ...prev.upiSettings, ...(data.upiSettings || {}) },
          }));
        }
      })
      .catch((err) => console.error('Error fetching site settings in admin:', err));
  }, []);

  const handleSaveSiteSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      });
      const data = await res.json();
      setSavingSettings(false);
      if (data.success) {
        setSaveAlert('✅ Top Support Header & Payment UPI QR Settings saved live!');
        setTimeout(() => setSaveAlert(''), 4000);
      }
    } catch (err) {
      setSavingSettings(false);
      alert('Failed to save settings');
    }
  };

  const handleQRImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please select a smaller photo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSiteSettings((prev) => ({
          ...prev,
          upiSettings: {
            ...prev.upiSettings,
            qrImageUrl: event.target?.result as string,
          },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleHoldAstrologer = async (id: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'ON_HOLD' ? 'ACTIVE' : 'ON_HOLD';
    setAstrologers((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
    );
    try {
      await fetch('/api/astrologers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_STATUS', id, status: nextStatus }),
      });
      setSaveAlert(`Astrologer account marked as ${nextStatus === 'ON_HOLD' ? 'ON HOLD (Suspended)' : 'ACTIVE'}.`);
      setTimeout(() => setSaveAlert(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAstrologerAccount = async (id: string, name: string) => {
    if (!confirm(`⚠️ Are you sure you want to PERMANENTLY DELETE the astrologer profile for "${name}"?\n\nThis will remove their portal login and profile from the website.`)) return;

    setAstrologers((prev) => prev.filter((a) => a.id !== id));
    try {
      await fetch('/api/astrologers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE_ASTROLOGER', id }),
      });
      setSaveAlert(`✅ Astrologer profile for ${name} deleted successfully.`);
      setTimeout(() => setSaveAlert(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };
  const [orders, setOrders] = useState<KuthiOrder[]>(INITIAL_KUTHI_ORDERS);
  const [astrologers, setAstrologers] = useState<Astrologer[]>(EMPANELED_ASTROLOGERS);
  const [services, setServices] = useState<ManagedService[]>(INITIAL_SERVICES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [shopProducts, setShopProducts] = useState<ProductItem[]>([]);
  const [shopOrders, setShopOrders] = useState<ShopOrder[]>([]);
  const [shopCategories, setShopCategories] = useState<string[]>(['Gemstones', 'Astrology Books', 'Yantras & Mala', 'Puja Items']);
  const [showCategoryManagerModal, setShowCategoryManagerModal] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showInlineNewCategory, setShowInlineNewCategory] = useState(false);
  
  // Client Base Management State
  const [clientBase, setClientBase] = useState<ClientUser[]>(INITIAL_CLIENT_BASE);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [inspectingClient, setInspectingClient] = useState<ClientUser | null>(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    whatsappNo: '',
    sex: 'Male' as 'Male' | 'Female' | 'Other',
    address: 'Imphal West, Manipur',
  });

  const handleRegisterNewClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientForm.name.trim() || !newClientForm.email.trim()) return;

    const newClient: ClientUser = {
      id: `client-${Date.now()}`,
      name: newClientForm.name,
      email: newClientForm.email.toLowerCase().trim(),
      phone: newClientForm.phone || '+91 98620 00000',
      whatsappNo: newClientForm.whatsappNo || newClientForm.phone || '+91 98620 00000',
      sex: newClientForm.sex,
      address: newClientForm.address,
      role: 'CLIENT',
      joinedAt: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      totalSpent: 0,
      savedKundlisCount: 1,
      status: 'VERIFIED',
    };

    setClientBase([newClient, ...clientBase]);
    try {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REGISTER_CLIENT', client: newClient }),
      });
    } catch (err) {
      console.error(err);
    }
    setSaveAlert(`✅ New Client "${newClient.name}" registered & verified in database!`);
    setShowAddClientModal(false);
    setNewClientForm({ name: '', email: '', phone: '', whatsappNo: '', sex: 'Male', address: 'Imphal West, Manipur' });
    setTimeout(() => setSaveAlert(''), 3500);
  };

  // Add / Edit Jyotish / Astrologer Guru State
  const DEFAULT_ASTRO_FORM = {
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
    name: '',
    username: '',
    phone: '',
    whatsappNo: '',
    sameAsWhatsapp: true,
    email: '',
    specialty: 'Kuthi Yengba & Vedic Astrology',
    experienceYears: 10,
    languages: ['Manipuri (Meiteilon)', 'English'],
    streetLane: 'Uripok Bachaspati Leikai',
    cityDistrict: 'Imphal West',
    state: 'Manipur',
    pincode: '795001',
    address: 'Imphal West, Manipur',
    payoutMethod: 'UPI' as 'UPI' | 'BANK',
    upiId: '',
    bankName: 'State Bank of India (SBI)',
    accountHolder: '',
    accountNo: '',
    ifscCode: 'SBIN0001234',
    planTier: 'ADVANCE' as 'BASIC' | 'ADVANCE' | 'PRO',
    allowedTools: [
      'kuthi-generator',
      'dasha-yengpham',
      'shani-sade-sati',
      'kaal-sarp-dosh',
      'astrology-yoga',
      'match-making',
      'kuthi-iba',
      'numit-leppa',
    ],
    password: '',
    status: 'ACTIVE' as 'ACTIVE' | 'ON_HOLD' | 'SUSPENDED',
  };

  const [editingAstroId, setEditingAstroId] = useState<string | null>(null);
  const [showAddAstroModal, setShowAddAstroModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newAstroForm, setNewAstroForm] = useState(DEFAULT_ASTRO_FORM);

  const handleRegisterNewAstro = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPhone = newAstroForm.phone.trim() || newAstroForm.whatsappNo.trim();
    const finalWhatsapp = newAstroForm.sameAsWhatsapp ? finalPhone : (newAstroForm.whatsappNo.trim() || finalPhone);

    if (!newAstroForm.name.trim() || !finalPhone) {
      alert('Please fill in Full Name and Contact Mobile Number.');
      return;
    }

    const compiledAddress = `${newAstroForm.streetLane ? newAstroForm.streetLane + ', ' : ''}${newAstroForm.cityDistrict ? newAstroForm.cityDistrict + ', ' : ''}${newAstroForm.state || 'Manipur'}${newAstroForm.pincode ? ' - ' + newAstroForm.pincode : ''}`;

    const astroPayload: Astrologer = {
      id: editingAstroId || 'astro-' + Date.now(),
      name: newAstroForm.name,
      avatar: newAstroForm.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
      username: newAstroForm.username || newAstroForm.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      specialty: newAstroForm.specialty || 'Kuthi Yengba & Vedic Astrology',
      phone: finalPhone,
      whatsappNo: finalWhatsapp,
      sameAsWhatsapp: newAstroForm.sameAsWhatsapp,
      email: newAstroForm.email,
      streetLane: newAstroForm.streetLane,
      cityDistrict: newAstroForm.cityDistrict,
      state: newAstroForm.state,
      pincode: newAstroForm.pincode,
      address: compiledAddress,
      experienceYears: Number(newAstroForm.experienceYears) || 10,
      languages: newAstroForm.languages,
      password: newAstroForm.password || 'guru123',
      status: newAstroForm.status,
      payoutMethod: newAstroForm.payoutMethod,
      upiId: newAstroForm.upiId,
      bankName: newAstroForm.bankName,
      accountHolder: newAstroForm.accountHolder || newAstroForm.name,
      accountNo: newAstroForm.accountNo,
      ifscCode: newAstroForm.ifscCode,
      planTier: newAstroForm.planTier,
      allowedTools: newAstroForm.allowedTools,
      completedCount: editingAstroId ? (astrologers.find(a => a.id === editingAstroId)?.completedCount || 0) : 0,
      pendingPayout: editingAstroId ? (astrologers.find(a => a.id === editingAstroId)?.pendingPayout || 0) : 0,
      showOnHome: true,
    };

    if (editingAstroId) {
      setAstrologers((prev) => prev.map((a) => (a.id === editingAstroId ? { ...a, ...astroPayload } : a)));
      try {
        await fetch('/api/astrologers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'UPDATE_ASTROLOGER', astrologer: astroPayload }),
        });
      } catch (err) {
        console.error(err);
      }
      setSaveAlert(`✅ Astrologer profile for "${astroPayload.name}" updated successfully!`);
    } else {
      setAstrologers([astroPayload, ...astrologers]);
      try {
        await fetch('/api/astrologers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'REGISTER_ASTROLOGER', astrologer: astroPayload }),
        });
      } catch (err) {
        console.error(err);
      }
      setSaveAlert(`🙏 ${astroPayload.name} added successfully as a registered Jyotish Guru!`);
    }

    setShowAddAstroModal(false);
    setEditingAstroId(null);
    setNewAstroForm(DEFAULT_ASTRO_FORM);
    setTimeout(() => setSaveAlert(''), 3500);
  };

  const handleUpdateAstrologerPassword = async (astroId: string, newPwd: string) => {
    if (!newPwd.trim()) return;

    setAstrologers((prev) =>
      prev.map((a) => (a.id === astroId ? { ...a, password: newPwd } : a))
    );

    if (selectedAstrologer && selectedAstrologer.id === astroId) {
      setSelectedAstrologer((prev) => (prev ? { ...prev, password: newPwd } : null));
    }

    try {
      await fetch('/api/astrologers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_ASTROLOGER',
          astrologer: { id: astroId, password: newPwd },
        }),
      });
    } catch (err) {
      console.error(err);
    }

    setShowPasswordUpdateModal(false);
    setNewPasswordInput('');
    setSaveAlert('🔒 Astrologer portal login password updated & saved successfully!');
    setTimeout(() => setSaveAlert(''), 3500);
  };
  // Theme State (Dark / Light) - Default to Dark for high-contrast celestial UI
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('admin_theme') as 'dark' | 'light';
    if (saved === 'dark') setTheme('light'); // Enforce bright warm luminous ivory matching site
    else setTheme('light');
    localStorage.setItem('admin_theme', 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('admin_theme', nextTheme);
  };

  const [commissionSettings, setCommissionSettings] = useState({ defaultCommissionPct: 15 });
  const [editingCommissionPct, setEditingCommissionPct] = useState(15);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showAddAnnouncementModal, setShowAddAnnouncementModal] = useState(false);
  const [newAnnouncementForm, setNewAnnouncementForm] = useState({
    title: '',
    message: '',
    type: 'ANNOUNCEMENT' as 'ANNOUNCEMENT' | 'PROMO_AD' | 'URGENT_NOTICE' | 'POLICY_UPDATE',
    badge: 'NEW ANNOUNCEMENT',
    actionText: 'Check Now',
    actionUrl: '/dashboard/astrologer',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    targetAudience: 'ALL_ASTROLOGERS' as 'ALL_ASTROLOGERS' | 'SPECIFIC_ASTROLOGER' | 'ALL_USERS',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [saveAlert, setSaveAlert] = useState('');

  // Delivery & Courier Assignment Modal State
  const [assignDeliveryModalOrder, setAssignDeliveryModalOrder] = useState<ShopOrder | null>(null);
  const [deliveryForm, setDeliveryForm] = useState({
    courierPartner: 'BlueDart Express',
    trackingNumber: '',
    deliveryAgentPhone: '+91 98620 11223',
    expectedDeliveryDate: '2026-08-30',
  });
  
  // Reviews Moderation State
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [editingReview, setEditingReview] = useState<Partial<CustomerReview> | null>(null);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    clientName: '',
    location: 'Imphal, Manipur',
    rating: 5,
    comment: '',
    serviceName: 'Kuthi Yengba Consultation',
    status: 'APPROVED' as 'APPROVED' | 'PENDING' | 'REJECTED',
  });

  // Inspection & Modals State
  const [inspectingOrder, setInspectingOrder] = useState<KuthiOrder | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);
  const [editingAstrologer, setEditingAstrologer] = useState<Partial<Astrologer> | null>(null);
  const [payoutModalAstro, setPayoutModalAstro] = useState<Astrologer | null>(null);
  const [payoutForm, setPayoutForm] = useState({
    amount: 0,
    paymentMethod: 'GPay / PhonePe UPI',
    utr: '',
    notes: 'Weekly Commission Payout Disbursement',
  });
  const [copiedText, setCopiedText] = useState(false);

  // Manage Astrologer Tool Access Permissions Modal State
  const ALL_TOOL_ITEMS = ACTIVE_TOOLS_REGISTRY;

  const [toolModalAstro, setToolModalAstro] = useState<any | null>(null);
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);

  const handleOpenToolModal = (astro: any) => {
    setToolModalAstro(astro);
    setSelectedToolIds(astro.allowedTools || ALL_TOOL_ITEMS.map((t) => t.id));
  };

  const handleSaveToolPermissions = async () => {
    if (!toolModalAstro) return;
    const updatedAstro = { ...toolModalAstro, allowedTools: selectedToolIds };

    setAstrologers((prev) =>
      prev.map((a) => (a.id === toolModalAstro.id ? updatedAstro : a))
    );

    try {
      await fetch('/api/astrologers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updateAstrologer: updatedAstro }),
      });
      alert(`Tool access permissions updated for ${toolModalAstro.name}!`);
      setToolModalAstro(null);
    } catch (err) {
      console.error('Error saving tool permissions:', err);
    }
  };

  // New Service Package Modal State
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({
    title: '',
    badge: 'Popular',
    price: '₹1,499',
    astroPayoutFee: 900,
    description: 'In-depth personalized astrological reading & remedies report.',
    feature1: 'D1 Lagna & Planetary Analysis',
    feature2: 'Vimshottari Dasha Forecast',
    feature3: 'Personalized Remedial Guidance PDF',
    cta: 'Book Now',
    link: '/kundli',
  });

  const handleCreateNewServicePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceForm.title.trim()) return;

    const newPackage: ManagedService = {
      id: 's-' + Date.now(),
      badge: newServiceForm.badge || 'New',
      title: newServiceForm.title,
      description: newServiceForm.description,
      features: [newServiceForm.feature1, newServiceForm.feature2, newServiceForm.feature3],
      price: newServiceForm.price.startsWith('₹') ? newServiceForm.price : `₹${newServiceForm.price}`,
      astroPayoutFee: newServiceForm.astroPayoutFee,
      cta: newServiceForm.cta || 'Book Consultation',
      link: newServiceForm.link || '/kundli',
      active: true,
    };

    const updatedServices = [...services, newPackage];
    setServices(updatedServices);

    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: updatedServices }),
      });
      setSaveAlert(`New Service Package "${newServiceForm.title}" Added & Published Live!`);
      setShowAddServiceModal(false);
      setNewServiceForm({
        title: '',
        badge: 'Popular',
        price: '₹1,499',
        astroPayoutFee: 900,
        description: 'In-depth personalized astrological reading & remedies report.',
        feature1: 'D1 Lagna & Planetary Analysis',
        feature2: 'Vimshottari Dasha Forecast',
        feature3: 'Personalized Remedial Guidance PDF',
        cta: 'Book Now',
        link: '/kundli',
      });
    } catch (err: any) {
      setSaveAlert('Failed to save service package');
    }
    setTimeout(() => setSaveAlert(''), 3000);
  };

  // Banner Ad State
  const [bannerAd, setBannerAd] = useState<{
    active: boolean;
    title: string;
    description: string;
    imageUrl: string;
    buttonText: string;
    buttonLink: string;
    theme: 'gold' | 'crimson' | 'emerald' | 'midnight';
  }>({
    active: true,
    title: '✨ Special Manipuri Astrological Offer',
    description: 'Get 20% OFF Kuthi Matching & Full 36-Gun Ashtakoot Compatibility Reports today!',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&q=80',
    buttonText: 'Claim 20% Discount →',
    buttonLink: '/matching',
    theme: 'gold',
  });

  const handleSaveBannerAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banner: bannerAd }),
      });
      if (res.ok) {
        setSaveAlert('📢 970x90 Banner Ad Updated & Published Live Across Website!');
      }
    } catch (err: any) {
      setSaveAlert('Failed to save banner ad');
    }
    setTimeout(() => setSaveAlert(''), 3000);
  };

  // Ticker Settings State
  const [tickerSettings, setTickerSettings] = useState<{
    active: boolean;
    speedSeconds: number;
    items: { id: string; name: string; place: string; action: string; time: string }[];
  }>({
    active: true,
    speedSeconds: 65,
    items: [
      { id: 't-1', name: 'Nganba', place: 'Imphal West', action: 'just started a consultation with Acharya Tombi Sharma', time: '2 min ago' },
      { id: 't-2', name: 'Thoibi', place: 'Thoubal', action: 'booked Kuthi Matching report with Pandit Ningthem Meitei', time: 'just now' },
      { id: 't-3', name: 'Ibomcha', place: 'Bishnupur', action: 'got his Vimshottari Dasha read by Gurumayum Sharma', time: '4 min ago' },
      { id: 't-4', name: 'Yaiphabi', place: 'Imphal East', action: 'generated her 30-Page Free Kundli Report', time: '1 min ago' },
      { id: 't-5', name: 'Laishram Rajen', place: 'Kakching', action: 'booked Rahu Dasha remedies with Acharya Tombi', time: '3 min ago' },
      { id: 't-6', name: 'Chingkhei', place: 'Churachandpur', action: 'consulted on 36-Gun Ashtakoot Milan with Saanvi Sharma', time: '5 min ago' },
      { id: 't-7', name: 'Sanatombi', place: 'Senapati', action: 'booked Sade Sati Gemstone consultation with Pt. Ram Naresh', time: 'just now' },
      { id: 't-8', name: 'Premkumar', place: 'Ukhrul', action: 'got his Career Horoscope reading from Acharya Tombi', time: '6 min ago' },
    ],
  });

  const [newTickerForm, setNewTickerForm] = useState({
    name: '',
    place: 'Imphal West',
    action: 'just started a consultation with Acharya Tombi Sharma',
    time: 'just now',
  });

  const handleSaveTickerSettings = async (updated?: typeof tickerSettings) => {
    const target = updated || tickerSettings;
    try {
      const res = await fetch('/api/ticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: target }),
      });
      if (res.ok) {
        setSaveAlert('✅ Live Activity Ticker settings & speed saved live!');
        setTimeout(() => setSaveAlert(''), 3500);
      }
    } catch (err) {
      console.error('Error saving ticker:', err);
    }
  };

  const handleAddTickerItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTickerForm.name.trim()) return;

    const newItem = {
      id: `t-${Date.now()}`,
      name: newTickerForm.name,
      place: newTickerForm.place || 'Imphal',
      action: newTickerForm.action,
      time: newTickerForm.time || 'just now',
    };

    const updated = {
      ...tickerSettings,
      items: [newItem, ...tickerSettings.items],
    };

    setTickerSettings(updated);
    handleSaveTickerSettings(updated);
    setNewTickerForm({
      name: '',
      place: 'Imphal West',
      action: 'just started a consultation with Acharya Tombi Sharma',
      time: 'just now',
    });
  };

  const handleDeleteTickerItem = (id: string) => {
    const updated = {
      ...tickerSettings,
      items: tickerSettings.items.filter((item) => item.id !== id),
    };
    setTickerSettings(updated);
    handleSaveTickerSettings(updated);
  };

  // Navbar Navigation Manager State & Handlers
  const [navConfig, setNavConfig] = useState<any>({
    items: [
      { id: 'nav-1', title: 'Horoscopes', href: '/horoscope', type: 'link', active: true, order: 1 },
      { id: 'nav-2', title: 'Astrologers', href: '/astrologers', type: 'link', active: true, order: 2 },
      {
        id: 'nav-3',
        title: 'Services',
        href: '/services',
        type: 'dropdown',
        active: true,
        order: 3,
        subItems: [
          { id: 'sub-s1', title: 'Kuthi Yengba (Horoscope Reading)', href: '/manipuri_kuthi_yengba', description: 'In-depth Dasha forecast & Vedic remedies', badge: 'POPULAR', active: true },
          { id: 'sub-s2', title: 'Kuthi Iba (Handwritten Creation)', href: '/manipuri_kuthi', description: 'Sacred parchment hand-written birth scroll', badge: 'TRADITIONAL', active: true },
          { id: 'sub-s3', title: 'Numit Leppa Yengba', href: '/numit_leppa_yengba', description: 'Auspicious muhurat date selection', badge: 'HOT', active: true },
          { id: 'sub-s4', title: 'Kundli Matching (36-Gun Milan)', href: '/matching', description: 'Marriage compatibility & Manglik check', active: true },
        ],
      },
      { id: 'nav-4', title: 'E-Store', href: '/shop', type: 'link', active: true, order: 4 },
      {
        id: 'nav-5',
        title: 'Free Tools',
        href: '/manipuri_free_kuthi',
        type: 'dropdown',
        badge: 'FREE',
        active: true,
        order: 5,
        subItems: [
          { id: 'sub-f1', title: 'Free Manipuri Kundli Generator', href: '/manipuri_free_kuthi', description: 'Generate natal chart PDF instantly', badge: 'FREE', active: true },
          { id: 'sub-f2', title: 'Free Gun Milan Matcher', href: '/matching', description: 'Quick 36-point Ashtakoot score check', active: true },
        ],
      },
      { id: 'nav-6', title: 'Blog', href: '/blog', type: 'link', active: true, order: 6 },
      { id: 'nav-7', title: 'Numit Leppa', href: '/numit_leppa_yengba', type: 'link', active: true, order: 7 },
    ],
    cbs: {
      showKuthiYengbaBtn: true,
      kuthiYengbaBtnText: 'Kuthi Yengba',
      kuthiYengbaBtnHref: '/manipuri_kuthi_yengba',
      showKuthiIbaBtn: true,
      kuthiIbaBtnText: 'Kuthi Iba',
      kuthiIbaBtnHref: '/manipuri_kuthi',
      showNumitLeppaBtn: true,
      numitLeppaBtnText: 'Numit Leppa',
      numitLeppaBtnHref: '/numit_leppa_yengba',
    },
  });

  useEffect(() => {
    fetch('/api/navbar')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          setNavConfig(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveNavConfig = async () => {
    try {
      const res = await fetch('/api/navbar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(navConfig),
      });
      if (res.ok) {
        setSaveAlert('📌 Header Navbar Menu & Dropdown Config Published Live!');
        setTimeout(() => setSaveAlert(''), 3500);
      }
    } catch (err) {
      console.error('Error saving navbar:', err);
    }
  };

  const handleAddNavItem = () => {
    const newItem = {
      id: `nav-${Date.now()}`,
      title: 'New Menu Item',
      href: '/services',
      type: 'link',
      active: true,
      order: (navConfig.items?.length || 0) + 1,
      subItems: [],
    };
    setNavConfig((prev: any) => ({
      ...prev,
      items: [...(prev.items || []), newItem],
    }));
  };

  const handleRemoveNavItem = (id: string) => {
    setNavConfig((prev: any) => ({
      ...prev,
      items: prev.items.filter((it: any) => it.id !== id),
    }));
  };

  const handleToggleNavItem = (id: string) => {
    setNavConfig((prev: any) => ({
      ...prev,
      items: prev.items.map((it: any) => (it.id === id ? { ...it, active: it.active === false } : it)),
    }));
  };

  const handleMoveNavItem = (id: string, direction: 'up' | 'down') => {
    const items = [...navConfig.items];
    const index = items.findIndex((it: any) => it.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    const updated = items.map((it: any, idx: number) => ({ ...it, order: idx + 1 }));
    setNavConfig((prev: any) => ({ ...prev, items: updated }));
  };

  const handleAddSubItem = (navId: string) => {
    const newSub = {
      id: `sub-${Date.now()}`,
      title: 'New Sub-Link',
      href: '/manipuri_kuthi_yengba',
      description: 'Consultation & services link',
      active: true,
    };
    setNavConfig((prev: any) => ({
      ...prev,
      items: prev.items.map((it: any) =>
        it.id === navId
          ? { ...it, subItems: [...(it.subItems || []), newSub] }
          : it
      ),
    }));
  };

  const handleRemoveSubItem = (navId: string, subId: string) => {
    setNavConfig((prev: any) => ({
      ...prev,
      items: prev.items.map((it: any) =>
        it.id === navId
          ? { ...it, subItems: (it.subItems || []).filter((s: any) => s.id !== subId) }
          : it
      ),
    }));
  };

  const [astrologerSectionSettings, setAstrologerSectionSettings] = useState({
    title: "Talk to Manipur's",
    highlightText: "Top Rated",
    subtitleTagline: "Every astrologer below has cleared a 4-step verification — qualification, panel interview, live audits, and a 30-day probation.",
    showRateOnHome: true,
    actionButtonType: 'both' as 'both' | 'chat_only' | 'call_only',
  });

  const [apiAstrologers, setApiAstrologers] = useState<any[]>([]);

  const handleSaveAstrologerSectionSettings = async () => {
    try {
      const res = await fetch('/api/astrologers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: astrologerSectionSettings }),
      });
      if (res.ok) {
        setSaveAlert('✅ Top Rated Astrologers Section Settings saved live!');
        setTimeout(() => setSaveAlert(''), 3500);
      }
    } catch (err) {
      console.error('Error saving astrologer section settings:', err);
    }
  };

  const handleToggleShowOnHome = async (id: string, currentVal: boolean) => {
    const updated = apiAstrologers.map((a) => (a.id === id ? { ...a, showOnHome: !currentVal } : a));
    setApiAstrologers(updated);
    try {
      await fetch('/api/astrologers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ astrologers: updated }),
      });
      setSaveAlert('✅ Homepage Featured Astrologer Selection Updated Live!');
      setTimeout(() => setSaveAlert(''), 3000);
    } catch (err) {
      console.error('Error toggling showOnHome:', err);
    }
  };

  const handleUpdateAstroRate = async (id: string, newRate: number) => {
    const updated = apiAstrologers.map((a) => (a.id === id ? { ...a, pricePerMin: newRate } : a));
    setApiAstrologers(updated);
    try {
      await fetch('/api/astrologers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ astrologers: updated }),
      });
      setSaveAlert('✅ Astrologer Rate Updated Live!');
      setTimeout(() => setSaveAlert(''), 3000);
    } catch (err) {
      console.error('Error updating astro rate:', err);
    }
  };

  const handleProcessPayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutModalAstro) return;

    const utr = payoutForm.utr || 'UPI-' + Math.floor(1000000000 + Math.random() * 900000000);
    const amt = payoutForm.amount || payoutModalAstro.pendingPayout;

    setAstrologers((prev) =>
      prev.map((a) => {
        if (a.id === payoutModalAstro.id) {
          const newPending = Math.max(0, a.pendingPayout - amt);
          const newPaidOut = (a.totalPaidOut || 0) + amt;
          return {
            ...a,
            pendingPayout: newPending,
            totalPaidOut: newPaidOut,
            payoutStatus: newPending === 0 ? 'SETTLED' : 'REQUESTED',
            payoutRequestedAmount: 0,
            lastPayoutUtr: utr,
            lastPayoutDate: new Date().toISOString().split('T')[0],
          };
        }
        return a;
      })
    );

    setSaveAlert(`✅ Payout of ₹${amt.toLocaleString()} successfully disbursed to ${payoutModalAstro.name}! (UTR: ${utr})`);
    setTimeout(() => setSaveAlert(''), 5000);
    setPayoutModalAstro(null);
  };

  // Fetch live services, blog posts, shop catalog, kuthi orders, banner ad, ticker, and astrologers settings on load
  useEffect(() => {
    fetch('/api/astrologers')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setAstrologerSectionSettings((prev) => ({ ...prev, ...data.settings }));
        if (data.astrologers && Array.isArray(data.astrologers)) setApiAstrologers(data.astrologers);
      })
      .catch((err) => console.error('Error fetching astrologers settings in admin:', err));
    fetch('/api/ticker')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ticker) setTickerSettings(data.ticker);
      })
      .catch((err) => console.error('Error fetching ticker in admin:', err));

    fetch('/api/banner')
      .then((res) => res.json())
      .then((data) => {
        if (data.banner) setBannerAd(data.banner);
      })
      .catch((err) => console.error('Error fetching banner ad:', err));

    fetch('/api/kuthi')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch((err) => console.error('Error fetching kuthi orders:', err));

    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.services) setServices(data.services);
      })
      .catch((err) => console.error('Error fetching admin services:', err));

    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) setBlogPosts(data.posts);
      })
      .catch((err) => console.error('Error fetching blog posts:', err));

    fetch('/api/shop')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setShopProducts(data.products);
        if (data.orders) setShopOrders(data.orders);
        if (data.categories) setShopCategories(data.categories);
        if (data.sliders) setShopSliders(data.sliders);
        if (data.commissionSettings) {
          setCommissionSettings(data.commissionSettings);
          setEditingCommissionPct(data.commissionSettings.defaultCommissionPct ?? 15);
        }
      })
      .catch((err) => console.error('Error fetching shop catalog:', err));

    fetch('/api/shop/coupons')
      .then((res) => res.json())
      .then((data) => {
        if (data.coupons && Array.isArray(data.coupons)) {
          setShopCoupons(data.coupons);
        }
      })
      .catch((err) => console.error('Error fetching shop coupons:', err));

    fetch('/api/announcements')
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements && Array.isArray(data.announcements)) {
          setAnnouncements(data.announcements);
        }
      })
      .catch((err) => console.error('Error fetching announcements:', err));

    fetch('/api/astrologers/payout')
      .then((res) => res.json())
      .then((data) => {
        if (data.wallets && Array.isArray(data.wallets)) {
          setAstrologers(data.wallets);
        }
      })
      .catch((err) => console.error('Error fetching astrologer wallets:', err));

    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews);
        setLoadingReviews(false);
      })
      .catch((err) => {
        console.error('Error fetching reviews in admin:', err);
        setLoadingReviews(false);
      });

    fetch('/api/clients')
      .then((res) => res.json())
      .then((data) => {
        if (data.clients && Array.isArray(data.clients)) {
          setClientBase(data.clients);
        }
      })
      .catch((err) => console.error('Error fetching client base:', err));
  }, []);

  const handleApproveReview = async (reviewId: string) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE_REVIEW', reviewId }),
      });
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
      setSaveAlert('✅ Review approved & published live to homepage!');
      setTimeout(() => setSaveAlert(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectReview = async (reviewId: string) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REJECT_REVIEW', reviewId }),
      });
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
      setSaveAlert('Review marked as rejected.');
      setTimeout(() => setSaveAlert(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this customer review?')) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE_REVIEW', reviewId }),
      });
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
      setSaveAlert('Review deleted.');
      setTimeout(() => setSaveAlert(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveReviewEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview || !editingReview.id) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_REVIEW', reviewId: editingReview.id, review: editingReview }),
      });
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
      setEditingReview(null);
      setSaveAlert('✅ Review updated successfully!');
      setTimeout(() => setSaveAlert(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateReviewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.clientName || !newReviewForm.comment) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE_REVIEW', review: newReviewForm }),
      });
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
      setShowAddReviewModal(false);
      setNewReviewForm({ clientName: '', location: 'Imphal, Manipur', rating: 5, comment: '', serviceName: 'Kuthi Yengba Consultation', status: 'APPROVED' });
      setSaveAlert('✅ New client review added & verified!');
      setTimeout(() => setSaveAlert(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmPayoutDisbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutModalAstro) return;

    try {
      const res = await fetch('/api/astrologers/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PROCESS_PAYOUT',
          astroId: payoutModalAstro.id,
          amount: payoutForm.amount,
          utr: payoutForm.utr,
          paymentMethod: payoutForm.paymentMethod,
          notes: payoutForm.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveAlert(data.error || 'Failed to process payout');
      } else {
        setAstrologers((prev) =>
          prev.map((a) =>
            a.id === payoutModalAstro.id
              ? { ...a, pendingPayout: data.wallet.pendingPayout }
              : a
          )
        );
        setSaveAlert(`✅ ${data.message}`);
        setPayoutModalAstro(null);
      }
    } catch (err: any) {
      setSaveAlert('Error processing payout disbursement');
    }
    setTimeout(() => setSaveAlert(''), 4000);
  };

  const handleForwardToAstrologer = async (o: KuthiOrder, astro: Astrologer) => {
    // 1. Persist assignment in backend API so it syncs to Astrologer Dashboard
    try {
      const res = await fetch('/api/kuthi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ASSIGN_ASTROLOGER',
          orderId: o.id,
          astroId: astro.id,
          astroName: astro.name,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      }
    } catch (err) {
      console.error('Error assigning astrologer:', err);
    }

    // 2. Build rich WhatsApp text with Kuthi file attachment link & birth details
    const host = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const fileLink = o.kuthiAttached && o.kuthiFileUrl
      ? (o.kuthiFileUrl.startsWith('http') ? o.kuthiFileUrl : `${host}${o.kuthiFileUrl}`)
      : (o.kuthiAttached ? `${host}/sample_kuthi.pdf` : 'No file attached (Birth Details provided below)');

    let message = `🙏 *KangleiAstro - New Consultation Order Assignment*\n\n`;
    message += `📌 *Order Ref:* ${o.orderRef}\n`;
    message += `👤 *Client Name:* ${o.clientName} (${o.sex})\n`;
    message += `📱 *Mobile / WhatsApp:* ${o.whatsappNo || o.mobile}\n`;
    message += `⭐ *Service Type:* ${o.serviceType || 'Kuthi Yengba Consultation'}\n\n`;

    if (o.groomDetails || o.brideDetails) {
      message += `💍 *Marriage Matching Details:*\n`;
      if (o.groomDetails) {
        message += `🤵 *Groom:* ${o.groomDetails.name} | DOB: ${o.groomDetails.dob} | TOB: ${o.groomDetails.tob} | POB: ${o.groomDetails.pob}\n`;
      }
      if (o.brideDetails) {
        message += `👰 *Bride:* ${o.brideDetails.name} | DOB: ${o.brideDetails.dob} | TOB: ${o.brideDetails.tob} | POB: ${o.brideDetails.pob}\n`;
      }
    } else {
      message += `📅 *Birth & Lineage Details:*\n`;
      if (o.fatherName) message += `- Father's Name: ${o.fatherName}\n`;
      if (o.motherName) message += `- Mother's Name: ${o.motherName}\n`;
      if (o.yek) message += `- Yek (Salai): ${o.yek}\n`;
      if (o.gotra) message += `- Gotra (Sagei): ${o.gotra}\n`;
      message += `- DOB: ${o.dob || 'See Kuthi Document'}\n`;
      message += `- TOB: ${o.tob || 'See Kuthi Document'}\n`;
      message += `- POB: ${o.pob || 'See Kuthi Document'}\n`;
      if (o.deliveryAddress) message += `- Hardcopy Delivery Address: ${o.deliveryAddress}\n`;
    }

    message += `\n📄 *Uploaded Kuthi Document Link / Attachment:*\n${fileLink}\n`;

    if (o.question) {
      message += `\n❓ *Client Question / Special Request:*\n"${o.question}"\n`;
    }

    message += `\n-----------------------------------`;
    message += `\n🔗 *Open Astrologer Dashboard:* ${host}/dashboard/astrologer`;

    const phoneNo = astro.whatsappNo.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${phoneNo}?text=${encodeURIComponent(message)}`;
    
    window.open(waUrl, '_blank');
    setSaveAlert(`✅ Order ${o.orderRef} assigned to ${astro.name} & forwarded to WhatsApp + Astrologer Dashboard!`);
    setTimeout(() => setSaveAlert(''), 3500);
  };

  const handleAssignAstrologer = async (orderId: string, astroId: string) => {
    const astro = astrologers.find(a => a.id === astroId);
    if (!astro) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              assignedAstrologerId: astro.id,
              assignedAstrologerName: astro.name,
              status: 'ASSIGNED',
            }
          : o
      )
    );

    try {
      await fetch('/api/kuthi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ASSIGN_ASTROLOGER', orderId, astroId: astro.id, astroName: astro.name }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleReportReceived = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              reportReceivedFromAstro: !o.reportReceivedFromAstro,
              status: !o.reportReceivedFromAstro ? 'REPORT_RECEIVED' : 'ASSIGNED',
            }
          : o
      )
    );

    try {
      await fetch('/api/kuthi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE_REPORT_RECEIVED', orderId }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkCompleted = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'COMPLETED' } : o))
    );
  };

  const handleServiceChange = (id: string, field: keyof ManagedService, value: any) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleFeatureChange = (serviceId: string, featureIndex: number, newText: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          const updatedFeatures = [...s.features];
          updatedFeatures[featureIndex] = newText;
          return { ...s, features: updatedFeatures };
        }
        return s;
      })
    );
  };

  const handleAddSubService = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          const newSub: SubServiceItem = {
            id: 'sub-' + Date.now(),
            title: 'New Sub-Service Option',
            price: 499,
            description: 'Sub-service details and delivery turnaround.',
          };
          return { ...s, subServices: [...(s.subServices || []), newSub] };
        }
        return s;
      })
    );
  };

  const handleUpdateSubService = (serviceId: string, subId: string, field: 'title' | 'price' | 'description', value: any) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId && s.subServices) {
          const updatedSubs = s.subServices.map((sub) => {
            if (sub.id === subId) {
              return { ...sub, [field]: field === 'price' ? (parseInt(value) || 0) : value };
            }
            return sub;
          });
          return { ...s, subServices: updatedSubs };
        }
        return s;
      })
    );
  };

  const handleRemoveSubService = (serviceId: string, subId: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId && s.subServices) {
          return { ...s, subServices: s.subServices.filter((sub) => sub.id !== subId) };
        }
        return s;
      })
    );
  };

  const handleSaveServices = async () => {
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveAlert('Services & Pricing Settings Saved & Live Across Website!');
      } else {
        setSaveAlert(data.error || 'Failed to save services');
      }
    } catch (err: any) {
      setSaveAlert(err.message || 'Error saving services');
    }
    setTimeout(() => setSaveAlert(''), 3000);
  };

  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.content) return;

    const newPost: BlogPost = {
      id: editingPost.id || 'post-' + Date.now(),
      slug: editingPost.slug || editingPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: editingPost.title,
      excerpt: editingPost.excerpt || editingPost.title,
      content: editingPost.content,
      category: editingPost.category || 'Vedic Guidance',
      coverImage: editingPost.coverImage || 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
      author: editingPost.author || 'Master Astrologer',
      readTime: editingPost.readTime || '5 min read',
      publishedAt: editingPost.publishedAt || new Date().toISOString().split('T')[0],
      views: editingPost.views || 10,
      likes: editingPost.likes || 5,
      status: editingPost.status || 'PUBLISHED',
    };

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE', post: newPost }),
      });
      const data = await res.json();
      if (data.posts) {
        setBlogPosts(data.posts);
        setSaveAlert('Blog Post Saved & Published Live!');
        setEditingPost(null);
      }
    } catch (err: any) {
      setSaveAlert(err.message || 'Failed to save blog post');
    }
    setTimeout(() => setSaveAlert(''), 3000);
  };

  const handleDeletePost = async (id: string) => {
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE', id }),
      });
      const data = await res.json();
      if (data.posts) {
        setBlogPosts(data.posts);
        setSaveAlert('Blog Post Deleted Successfully!');
      }
    } catch (err: any) {
      setSaveAlert(err.message || 'Failed to delete blog post');
    }
    setTimeout(() => setSaveAlert(''), 3000);
  };

  const handleProductImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && editingProduct) {
        setEditingProduct((prev) => (prev ? { ...prev, image: dataUrl } : prev));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const catName = newCategoryInput.trim();
    if (!catName) return;

    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE_CATEGORY', category: catName }),
      });
      const data = await res.json();
      if (data.categories) {
        setShopCategories(data.categories);
        setNewCategoryInput('');
        setShowInlineNewCategory(false);
        if (editingProduct) {
          setEditingProduct((prev) => (prev ? { ...prev, category: catName } : prev));
        }
        setSaveAlert(`✅ Category "${catName}" created & live!`);
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE_CATEGORY', category: catName }),
      });
      const data = await res.json();
      if (data.categories) {
        setShopCategories(data.categories);
        setSaveAlert(`Category "${catName}" removed.`);
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon || !editingCoupon.code) return;

    const couponToSave: CouponItem = {
      id: editingCoupon.id || 'c-' + Date.now(),
      code: editingCoupon.code.toUpperCase().trim(),
      type: editingCoupon.type || 'PERCENTAGE',
      value: Number(editingCoupon.value) || 0,
      minOrderAmount: Number(editingCoupon.minOrderAmount) || 0,
      active: editingCoupon.active !== false,
      usageCount: editingCoupon.usageCount || 0,
    };

    try {
      const res = await fetch('/api/shop/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE_COUPON', coupon: couponToSave }),
      });
      const data = await res.json();
      if (data.coupons) {
        setShopCoupons(data.coupons);
        setEditingCoupon(null);
        setShowCouponModal(false);
        setSaveAlert(`✅ Promo Coupon ${couponToSave.code} saved!`);
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error('Error saving coupon:', err);
    }
  };

  const handleToggleCouponActive = async (coupon: CouponItem) => {
    const updated = { ...coupon, active: !coupon.active };
    try {
      const res = await fetch('/api/shop/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_COUPON', coupon: updated }),
      });
      const data = await res.json();
      if (data.coupons) {
        setShopCoupons(data.coupons);
        setSaveAlert(`Coupon ${coupon.code} is now ${updated.active ? 'ACTIVE' : 'INACTIVE'}.`);
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete promo coupon "${code}"?`)) return;
    try {
      const res = await fetch('/api/shop/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE_COUPON', id }),
      });
      const data = await res.json();
      if (data.coupons) {
        setShopCoupons(data.coupons);
        setSaveAlert(`Promo coupon "${code}" deleted.`);
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSlider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlider || !editingSlider.title) return;

    const sliderToSave: ShopSliderItem = {
      id: editingSlider.id || 'slider-' + Date.now(),
      badge: editingSlider.badge || '✨ AUTHENTIC MANIPURI & VEDIC CONSECRATED STORE',
      title: editingSlider.title,
      highlightText: editingSlider.highlightText || '',
      subtitle: editingSlider.subtitle || '',
      image: editingSlider.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
      ctaText: editingSlider.ctaText || 'Shop Now',
      ctaLink: editingSlider.ctaLink || '/shop',
      bgColor: editingSlider.bgColor || 'from-[#0b132b] via-[#1c2541] to-[#0b132b]',
      active: editingSlider.active !== undefined ? editingSlider.active : true,
      displayOrder: editingSlider.displayOrder || (shopSliders.length + 1),
    };

    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SAVE_SLIDER', slider: sliderToSave }),
      });
      const data = await res.json();
      if (data.sliders) {
        setShopSliders(data.sliders);
        setEditingSlider(null);
        setShowSliderModal(false);
        setSaveAlert(`✅ Shop Hero Slider "${sliderToSave.title}" saved live!`);
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error('Error saving slider:', err);
    }
  };

  const handleToggleSlider = async (id: string) => {
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE_SLIDER', id }),
      });
      const data = await res.json();
      if (data.sliders) {
        setShopSliders(data.sliders);
        setSaveAlert(`Slider banner status updated.`);
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSlider = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete slider banner "${title}"?`)) return;
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE_SLIDER', id }),
      });
      const data = await res.json();
      if (data.sliders) {
        setShopSliders(data.sliders);
        setSaveAlert(`Slider banner "${title}" deleted.`);
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCommissionRate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_COMMISSION', defaultCommissionPct: Number(editingCommissionPct) }),
      });
      const data = await res.json();
      if (data.commissionSettings) {
        setCommissionSettings(data.commissionSettings);
        setSaveAlert(`✅ Default Platform Commission set to ${editingCommissionPct}%!`);
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to parse CSV/TSV lines taking quotes into account
  const parseCSVOrTSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
    if (lines.length === 0) return [];

    const isTSV = lines[0].includes('\t');
    const separator = isTSV ? '\t' : ',';

    const parseLine = (line: string) => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === separator && !inQuotes) {
          result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
      return result;
    };

    const headers = parseLine(lines[0]).map((h) => h.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseLine(lines[i]);
      if (values.length < 2) continue;
      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });
      rows.push(rowObj);
    }
    return rows;
  };

  const handleImportCSVFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      if (!content) return;

      try {
        const rows = parseCSVOrTSV(content);
        if (rows.length === 0) {
          alert('⚠️ No valid product rows found in the uploaded CSV/TSV file.');
          return;
        }

        const importedProducts: ProductItem[] = rows.map((r, idx) => {
          const sku = r['sku'] || r['product_sku'] || `AG-GEM-${Date.now()}-${idx}`;
          const title = r['product_title'] || r['title'] || r['name'] || `Astrological Product ${idx + 1}`;
          const category = r['category'] || 'Precious Gemstones';
          const rulingPlanet = r['ruling_planet'] || r['rulingplanet'];
          const zodiacRashi = r['zodiac_rashi'] || r['zodiacrashi'];
          const caratWeight = Number(r['carat_weight'] || r['caratweight']) || undefined;
          const rattiWeight = Number(r['ratti_weight'] || r['rattiweight']) || undefined;
          const origin = r['origin'];
          const color = r['color'];
          const cutShape = r['cut_shape'] || r['cutshape'];
          const treatment = r['treatment'];
          const certification = r['certification'];
          const recommendedMetal = r['recommended_metal'] || r['recommendedmetal'];
          const wearingFinger = r['wearing_finger'] || r['wearingfinger'];
          const wearingDayTime = r['wearing_day_time'] || r['wearingdaytime'];
          const vedicMantra = r['vedic_mantra'] || r['vedicmantra'];
          const shortDescription = r['short_description'] || r['shortdescription'];
          const description = r['long_description'] || r['description'] || shortDescription || title;
          const price = Number(r['price_inr'] || r['price']) || 4999;
          const stock = Number(r['stock_quantity'] || r['stock']) || 5;
          const image = r['image_placeholder_url'] || r['image_url'] || r['image'] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop';
          const seoMetaTitle = r['seo_meta_title'] || r['seometatitle'];
          const seoMetaDescription = r['seo_meta_description'] || r['seometadescription'];

          return {
            id: sku,
            sku,
            title,
            category,
            rulingPlanet,
            zodiacRashi,
            caratWeight,
            rattiWeight,
            origin,
            color,
            cutShape,
            treatment,
            certification,
            recommendedMetal,
            wearingFinger,
            wearingDayTime,
            vedicMantra,
            shortDescription,
            description,
            price,
            originalPrice: Math.round(price * 1.25),
            stock,
            image,
            seoMetaTitle,
            seoMetaDescription,
            rating: 4.9,
            reviewsCount: 30 + idx,
            sellerType: 'PLATFORM',
            sellerName: 'KangleiAstro Store',
            status: 'APPROVED',
            badge: category.split('>')[0].trim().toUpperCase() || 'AUTHENTIC',
            features: [
              ...(rulingPlanet ? [`Ruling Planet: ${rulingPlanet}`] : []),
              ...(origin ? [`Origin: ${origin}`] : []),
              ...(certification ? [`Lab Certified: ${certification}`] : []),
            ],
          };
        });

        const res = await fetch('/api/shop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'IMPORT_PRODUCTS', products: importedProducts }),
        });
        const data = await res.json();
        if (data.products) {
          setShopProducts(data.products);
          if (data.categories) setShopCategories(data.categories);
          setSaveAlert(`✅ Successfully imported ${importedProducts.length} astrological products into E-Store catalog!`);
          setTimeout(() => setSaveAlert(''), 4000);
        }
      } catch (err) {
        console.error('Error importing CSV:', err);
        alert('❌ Failed to parse CSV file. Please check formatting.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportProductsCSV = () => {
    if (!shopProducts || shopProducts.length === 0) {
      alert('⚠️ No products available to export.');
      return;
    }

    const headers = [
      'SKU', 'Product_Title', 'Category', 'Ruling_Planet', 'Zodiac_Rashi',
      'Carat_Weight', 'Ratti_Weight', 'Origin', 'Color', 'Cut_Shape',
      'Treatment', 'Certification', 'Recommended_Metal', 'Wearing_Finger',
      'Wearing_Day_Time', 'Vedic_Mantra', 'Short_Description', 'Long_Description',
      'Price_INR', 'Stock_Quantity', 'Image_Placeholder_URL', 'SEO_Meta_Title', 'SEO_Meta_Description'
    ];

    const escapeCell = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [
      headers.join('\t'),
      ...shopProducts.map((p) => [
        escapeCell(p.sku || p.id),
        escapeCell(p.title),
        escapeCell(p.category),
        escapeCell(p.rulingPlanet || ''),
        escapeCell(p.zodiacRashi || ''),
        escapeCell(p.caratWeight || ''),
        escapeCell(p.rattiWeight || ''),
        escapeCell(p.origin || ''),
        escapeCell(p.color || ''),
        escapeCell(p.cutShape || ''),
        escapeCell(p.treatment || ''),
        escapeCell(p.certification || ''),
        escapeCell(p.recommendedMetal || ''),
        escapeCell(p.wearingFinger || ''),
        escapeCell(p.wearingDayTime || ''),
        escapeCell(p.vedicMantra || ''),
        escapeCell(p.shortDescription || ''),
        escapeCell(p.description || ''),
        escapeCell(p.price),
        escapeCell(p.stock),
        escapeCell(p.image),
        escapeCell(p.seoMetaTitle || ''),
        escapeCell(p.seoMetaDescription || ''),
      ].join('\t'))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kangleiastro_products_export_${new Date().toISOString().split('T')[0]}.tsv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApproveProduct = async (productId: string) => {
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE_PRODUCT', id: productId }),
      });
      const data = await res.json();
      if (data.products) {
        setShopProducts(data.products);
        setSaveAlert('✅ Astrologer Product approved & published live to E-Store!');
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectProduct = async (productId: string) => {
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REJECT_PRODUCT', id: productId }),
      });
      const data = await res.json();
      if (data.products) {
        setShopProducts(data.products);
        setSaveAlert('Product submission rejected.');
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmAstroOrder = async (orderId: string) => {
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CONFIRM_ASTRO_ORDER', id: orderId }),
      });
      const data = await res.json();
      if (data.orders) {
        setShopOrders(data.orders);
        setSaveAlert('✅ Astrologer vendor order confirmed & payout credited!');
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleProductFeatured = async (productId: string) => {
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE_FEATURED_PRODUCT', id: productId }),
      });
      const data = await res.json();
      if (data.products) {
        setShopProducts(data.products);
        setSaveAlert('✅ Product homepage featured status toggled!');
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSingleProductCommission = async (productId: string, commissionPct: number) => {
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_PRODUCT_COMMISSION', id: productId, adminCommissionPct: commissionPct }),
      });
      const data = await res.json();
      if (data.products) {
        setShopProducts(data.products);
        setSaveAlert(`✅ Custom commission set to ${commissionPct}% for this product!`);
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementForm.title || !newAnnouncementForm.message) return;

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE', announcement: newAnnouncementForm }),
      });
      const data = await res.json();
      if (data.announcements) {
        setAnnouncements(data.announcements);
        setShowAddAnnouncementModal(false);
        setNewAnnouncementForm({
          title: '',
          message: '',
          type: 'ANNOUNCEMENT',
          badge: 'NEW ANNOUNCEMENT',
          actionText: 'Check Now',
          actionUrl: '/dashboard/astrologer',
          imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
          targetAudience: 'ALL_ASTROLOGERS',
        });
        setSaveAlert('✅ Announcement published live for Astrologers!');
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE', id }),
      });
      const data = await res.json();
      if (data.announcements) {
        setAnnouncements(data.announcements);
        setSaveAlert('Announcement removed.');
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.price) return;

    const newProd: ProductItem = {
      id: editingProduct.id || 'prod-' + Date.now(),
      title: editingProduct.title,
      category: editingProduct.category || 'Gemstones',
      price: Number(editingProduct.price),
      originalPrice: Number(editingProduct.originalPrice || editingProduct.price * 1.2),
      rating: editingProduct.rating || 4.9,
      reviewsCount: editingProduct.reviewsCount || 12,
      image: editingProduct.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
      badge: editingProduct.badge || 'Certified Original',
      stock: Number(editingProduct.stock || 10),
      description: editingProduct.description || editingProduct.title,
      features: editingProduct.features || ['Authentic Vedic Remedy', 'Consecrated by Master Pandits'],
    };

    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE_PRODUCT', product: newProd }),
      });
      const data = await res.json();
      if (data.products) {
        setShopProducts(data.products);
        setSaveAlert('E-Store Product Saved & Live!');
        setEditingProduct(null);
      }
    } catch (err: any) {
      setSaveAlert(err.message || 'Failed to save product');
    }
    setTimeout(() => setSaveAlert(''), 3000);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE_PRODUCT', id }),
      });
      const data = await res.json();
      if (data.products) {
        setShopProducts(data.products);
        setSaveAlert('Product Deleted From E-Store!');
      }
    } catch (err: any) {
      setSaveAlert(err.message || 'Failed to delete product');
    }
    setTimeout(() => setSaveAlert(''), 3000);
  };

  const handleUpdateShopOrderStatus = async (id: string, newStatus: any) => {
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_ORDER_STATUS', id, status: newStatus }),
      });
      const data = await res.json();
      if (data.orders) {
        setShopOrders(data.orders);
        setSaveAlert('✅ Shop Order Status Updated Live!');
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateShopOrderPaymentStatus = async (id: string, paymentStatus: string) => {
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_PAYMENT_STATUS', id, paymentStatus }),
      });
      const data = await res.json();
      if (data.orders) {
        setShopOrders(data.orders);
        setSaveAlert(`✅ Shop Order Payment Status updated to ${paymentStatus}!`);
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateKuthiOrderPaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const res = await fetch('/api/kuthi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_PAYMENT_STATUS', orderId, paymentStatus }),
      });
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
        setSaveAlert(`✅ Kuthi Order Payment Status updated to ${paymentStatus}!`);
        setTimeout(() => setSaveAlert(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignDeliveryModalOrder) return;

    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ASSIGN_DELIVERY',
          id: assignDeliveryModalOrder.id,
          ...deliveryForm,
        }),
      });
      const data = await res.json();
      if (data.orders) {
        setShopOrders(data.orders);
        setAssignDeliveryModalOrder(null);
        setSaveAlert('✅ Delivery Assigned & Tracking AWB Issued!');
        setTimeout(() => setSaveAlert(''), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAstrologer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAstrologer?.name || !editingAstrologer?.whatsappNo) return;

    const pwd = editingAstrologer.password || 'astro123';
    const uname = editingAstrologer.username || editingAstrologer.name.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const newAstro: Astrologer = {
      id: editingAstrologer.id || 'astro-' + Date.now(),
      name: editingAstrologer.name,
      username: uname,
      specialty: editingAstrologer.specialty || 'Vedic Horoscope Specialist',
      phone: editingAstrologer.phone || editingAstrologer.whatsappNo,
      whatsappNo: editingAstrologer.whatsappNo,
      address: editingAstrologer.address || 'Imphal West, Manipur',
      experienceYears: Number(editingAstrologer.experienceYears || 10),
      password: pwd,
      completedCount: editingAstrologer.completedCount || 0,
      pendingPayout: editingAstrologer.pendingPayout || 0,
    };

    setAstrologers((prev) => {
      const idx = prev.findIndex((a) => a.id === newAstro.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newAstro;
        return copy;
      }
      return [...prev, newAstro];
    });

    try {
      await fetch('/api/astrologers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SAVE_ASTROLOGER', astrologer: newAstro }),
      });
    } catch (err) {
      console.warn('API save astrologer:', err);
    }

    setSaveAlert(`Empaneled Astrologer ${newAstro.name} (@${uname}) registered with credentials!`);
    setEditingAstrologer(null);
    setTimeout(() => setSaveAlert(''), 3000);
  };

  const handleCopyDetails = (order: KuthiOrder) => {
    let text = '';
    if (order.groomDetails || (order.dob && order.dob.includes('Groom:'))) {
      text = `📜 KANGLEIASTRO KUTHI MATCHING DETAILS
Order Ref: ${order.orderRef}
Couple Name: ${order.clientName}
WhatsApp Contact: ${order.whatsappNo}
Amount Paid: ₹${order.amount} (UTR: ${order.utr})

👦 GROOM DETAILS:
• Name: ${order.groomDetails?.name || order.clientName.split('&')[0]?.trim()}
• DOB: ${order.groomDetails?.dob || order.dob?.split('|')[0]?.replace('Groom:', '').trim()}
• TOB: ${order.groomDetails?.tob || order.tob?.split('|')[0]?.replace('Groom:', '').trim()}
• POB: ${order.groomDetails?.pob || order.pob?.split('|')[0]?.replace('Groom:', '').trim()}

👧 BRIDE DETAILS:
• Name: ${order.brideDetails?.name || order.clientName.split('&')[1]?.trim()}
• DOB: ${order.brideDetails?.dob || order.dob?.split('|')[1]?.replace('Bride:', '').trim()}
• TOB: ${order.brideDetails?.tob || order.tob?.split('|')[1]?.replace('Bride:', '').trim()}
• POB: ${order.brideDetails?.pob || order.pob?.split('|')[1]?.replace('Bride:', '').trim()}

Notes / Status: ${order.question || 'Marriage Compatibility & Ashtakoot Milan'}`;
    } else {
      text = `📜 KANGLEIASTRO KUTHI YENGBA DETAILS
Order Ref: ${order.orderRef}
Client Name: ${order.clientName} (${order.sex})
WhatsApp: ${order.whatsappNo}
Date of Birth: ${order.dob || 'See Kuthi Paper'}
Time of Birth: ${order.tob || 'See Kuthi Paper'}
Place of Birth: ${order.pob || 'See Kuthi Paper'}
Kuthi File Attached: ${order.kuthiAttached ? order.kuthiFileName : 'No File (Use Birth Details)'}
Questions: ${order.question || 'General Kuthi Yengba & Remedies'}`;
    }

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orderRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.mobile.includes(searchTerm) ||
      o.utr.includes(searchTerm) ||
      (o.assignedAstrologerName && o.assignedAstrologerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ADMIN PASSWORD AUTHENTICATION GATE
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 font-sans transition-colors ${
        theme === 'dark' ? 'bg-[#0b132b] text-white' : 'bg-[#faf8f5] text-slate-900'
      }`}>
        <div className="w-full max-w-md bg-white dark:bg-[#1c2541] rounded-3xl border border-amber-300 dark:border-[#3a506b] shadow-2xl p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-[#0b132b] border border-amber-300 dark:border-[#fbbf24]/40 text-[#d97706] flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-8 h-8 text-[#d97706]" />
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 text-[11px] font-extrabold uppercase tracking-wider inline-block">
              🛡️ Restricted Security Clearance
            </span>
            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
              Admin Security Portal
            </h2>
            <p className="text-xs text-slate-600 dark:text-gray-400">
              Please enter your administrator password to unlock the KangleiAstro admin control panel.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-bold text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1.5">
                Admin Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter admin password (e.g. admin123)"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-[#3a506b] bg-slate-50 dark:bg-[#0b132b] text-slate-900 dark:text-white font-mono font-bold text-sm focus:border-[#d97706] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate & Unlock Admin Panel</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex font-sans antialiased transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0b132b] text-[#faf8f4]' : 'bg-[#fffdfa] text-[#0f172a]'
    }`}>
      
      {/* ─────────────────────────────────────────────────────────────
         1. ROYAL VEDIC LEFT SIDEBAR DRAWER (Midnight Navy & Gold Theme)
         ───────────────────────────────────────────────────────────── */}
      <aside className={`w-64 border-r flex flex-col justify-between shrink-0 hidden md:flex min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#0f172a] border-[#1e293b]' : 'bg-white border-[#f3e8d2] shadow-md'
      }`}>
        <div>
          {/* App Brand Header */}
          <div className={`h-16 px-6 border-b flex items-center justify-between ${
            theme === 'dark' ? 'border-[#1e293b]' : 'border-[#f3e8d2]'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#d97706] to-[#f59e0b] text-white flex items-center justify-center shadow-md">
                <Moon className="w-5 h-5 fill-[#fbbf24] text-[#fbbf24]" />
              </div>
              <div>
                <span className={`font-serif text-lg font-bold block leading-tight ${
                  theme === 'dark' ? 'text-white' : 'text-[#0f172a]'
                }`}>
                  KuthiYengpham
                </span>
                <span className="text-[10px] text-[#d97706] font-extrabold uppercase tracking-wider block">
                  by KangleiAstro • Admin Portal
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links (Categorized for Easy Navigation) */}
          <div className="p-4 space-y-6">
            
            {/* Category 1: DASHBOARD */}
            <div>
              <span className={`text-[10px] uppercase tracking-wider block px-3 mb-2 font-extrabold ${
                theme === 'dark' ? 'text-[#e0a96d]' : 'text-[#b45309]'
              }`}>
                Dashboard
              </span>
              <div className="space-y-1">
                {/* 1. Overview & Analytics */}
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-[#0f172a] hover:bg-[#fef3c7] hover:text-[#b45309] font-bold'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Overview & Analytics</span>
                </button>

                {/* 2. Kuthi Orders Hub */}
                <button
                  onClick={() => setActiveTab('kuthi')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'kuthi'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-[#0f172a] hover:bg-[#fef3c7] hover:text-[#b45309] font-bold'
                  }`}
                >
                  <FileText className="w-4 h-4 text-[#d97706] shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Kuthi Orders Hub</span>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#78350f] text-[10px] font-extrabold border border-[#fde68a]">
                    {orders.filter(o => o.status !== 'COMPLETED').length}
                  </span>
                </button>
              </div>
            </div>

            {/* Category: WEBSITE CMS & SERVICES */}
            <div className="pt-2">
              <span className={`text-[10px] uppercase tracking-wider block px-3 mb-2 font-extrabold ${
                theme === 'dark' ? 'text-[#e0a96d]' : 'text-[#b45309]'
              }`}>
                Website CMS & Services
              </span>
              <div className="space-y-1 pl-1 border-l-2 border-[#d97706]/40 ml-2">
                {/* 1. Website Astrologers */}
                <button
                  onClick={() => setActiveTab('astro_website')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'astro_website'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-[#0f172a] hover:bg-[#fef3c7] hover:text-[#b45309] font-bold'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#d97706] shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Website Astrologers</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-[#b45309] border border-amber-300'
                  }`}>
                    CMS Display
                  </span>
                </button>

                {/* 2. Website Services */}
                <button
                  onClick={() => setActiveTab('astro_services')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'astro_services' || activeTab === 'astro_rates'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-[#0f172a] hover:bg-[#fef3c7] hover:text-[#b45309] font-bold'
                  }`}
                >
                  <Tag className="w-4 h-4 text-[#d97706] shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Website Services</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-[#b45309] border border-amber-300'
                  }`}>
                    {services.length} Services
                  </span>
                </button>

                {/* 3. Navbar Navigation Controller */}
                <button
                  onClick={() => setActiveTab('navbar')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'navbar'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-[#0f172a] hover:bg-[#fef3c7] hover:text-[#b45309] font-bold'
                  }`}
                >
                  <Menu className="w-4 h-4 text-[#d97706] shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Navbar Menu Manager</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-[#b45309] border border-amber-300'
                  }`}>
                    Top Menu
                  </span>
                </button>
              </div>
            </div>

            {/* Category 2: GURU & JYOTISH SECTION */}
            <div className="pt-2">
              <span className={`text-[10px] uppercase tracking-wider block px-3 mb-2 font-extrabold ${
                theme === 'dark' ? 'text-[#e0a96d]' : 'text-[#b45309]'
              }`}>
                Guru & Jyotish Section
              </span>
              <div className="space-y-1 pl-1 border-l-2 border-[#d97706]/40 ml-2">
                {/* 1. All Jyotishs */}
                <button
                  onClick={() => setActiveTab('astrologers')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'astrologers'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-[#0f172a] hover:bg-[#fef3c7] hover:text-[#b45309] font-bold'
                  }`}
                >
                  <Award className="w-4 h-4 text-[#d97706] shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">All Jyotishs</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30' : 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]'
                  }`}>
                    {astrologers.length} Gurus
                  </span>
                </button>

                {/* 2. Payout Request */}
                <button
                  onClick={() => setActiveTab('astro_payouts')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'astro_payouts'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-[#0f172a] hover:bg-[#fef3c7] hover:text-[#b45309] font-bold'
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-green-600 shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Payout Request</span>
                  {astrologers.filter((a) => a.payoutStatus === 'REQUESTED' || a.pendingPayout > 0).length > 0 ? (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold animate-pulse">
                      ₹{astrologers.reduce((s, a) => s + (a.pendingPayout || 0), 0).toLocaleString()}
                    </span>
                  ) : (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-extrabold border border-green-200">
                      Settled
                    </span>
                  )}
                </button>

                {/* 3. Assign List */}
                <button
                  onClick={() => setActiveTab('astro_assign_list')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'astro_assign_list'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-[#0f172a] hover:bg-[#fef3c7] hover:text-[#b45309] font-bold'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Assign List</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' : 'bg-sky-100 text-sky-800 border-sky-200'
                  }`}>
                    {orders.filter(o => o.assignedAstrologerId || o.status === 'ASSIGNED').length} Assigned
                  </span>
                </button>

                {/* 4. Add Jyotish */}
                <button
                  onClick={() => {
                    setEditingAstroId(null);
                    setNewAstroForm(DEFAULT_ASTRO_FORM);
                    setActiveTab('add_astro');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'add_astro'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : 'bg-[#fef3c7] text-[#b45309] hover:bg-[#fde68a] border border-[#fde68a]'
                  }`}
                >
                  <Plus className="w-4 h-4 text-[#d97706] shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">+ Add Jyotish</span>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-white text-[#d97706] text-[10px] font-extrabold border border-[#fde68a]">
                    New Guru
                  </span>
                </button>
              </div>
            </div>

            {/* Category: E-STORE OPERATIONS */}
            <div className="pt-2">
              <span className={`text-[10px] uppercase tracking-wider block px-3 mb-2 font-extrabold ${
                theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-800'
              }`}>
                🛒 E-Store Operations
              </span>
              <div className="space-y-1 pl-1 border-l-2 border-[#d97706]/40 ml-2">
                {/* 1. All Orders & Status */}
                <button
                  onClick={() => setActiveTab('shop_orders')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'shop_orders' || activeTab === 'shop'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">E-Store Orders & UTR</span>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-green-500/20 text-green-700 text-[10px] font-extrabold border border-green-500/30">
                    {shopOrders.length}
                  </span>
                </button>

                {/* 2. Add / Edit Products */}
                <button
                  onClick={() => setActiveTab('shop_products')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'shop_products'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <Package className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Add & Edit Products</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {shopProducts.length} Items
                  </span>
                </button>

                {/* 3. Astrologer Vendor Products & Verification */}
                <button
                  onClick={() => setActiveTab('shop_astro_products')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'shop_astro_products'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <Award className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Astrologer Products</span>
                  {shopProducts.filter((p) => p.sellerType === 'ASTROLOGER' && p.status === 'PENDING_APPROVAL').length > 0 ? (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-amber-500 text-slate-900 text-[10px] font-extrabold animate-pulse">
                      {shopProducts.filter((p) => p.sellerType === 'ASTROLOGER' && p.status === 'PENDING_APPROVAL').length} Pending
                    </span>
                  ) : (
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      theme === 'dark' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-900 border-purple-300'
                    }`}>
                      {shopProducts.filter((p) => p.sellerType === 'ASTROLOGER').length} Vendor
                    </span>
                  )}
                </button>

                {/* 4. Assign Delivery & Courier Logistics */}
                <button
                  onClick={() => setActiveTab('shop_delivery')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'shop_delivery'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <Truck className="w-4 h-4 text-sky-500 shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Assign Delivery</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' : 'bg-sky-100 text-sky-900 border-sky-300'
                  }`}>
                    Courier
                  </span>
                </button>

                {/* 5. Promo Coupons & Discounts */}
                <button
                  onClick={() => setActiveTab('shop_coupons')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'shop_coupons'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <Tag className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Promo Coupons</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}>
                    {shopCoupons.length} Vouchers
                  </span>
                </button>

                {/* 6. Product Sliders CMS */}
                <button
                  onClick={() => setActiveTab('shop_sliders')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'shop_sliders'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Shop Sliders CMS</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {shopSliders.length} Banners
                  </span>
                </button>
              </div>
            </div>

            {/* Category: ASTROLOGER ANNOUNCEMENTS & ADS */}
            <div>
              <span className={`text-[10px] uppercase tracking-wider block px-3 mb-2 font-extrabold ${
                theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-800'
              }`}>
                Announcements & Ads
              </span>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'announcements'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                }`}
              >
                <Bell className="w-4 h-4 text-[#d97706] shrink-0" />
                <span className="flex-1 text-center font-bold px-2 leading-tight">Astrologer Announcements</span>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  theme === 'dark' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  {announcements.length} Ads
                </span>
              </button>
            </div>

            {/* Category: MANAGEMENT & SETTINGS */}
            <div>
              <span className={`text-[10px] uppercase tracking-wider block px-3 mb-2 font-extrabold ${
                theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-800'
              }`}>
                Management & Settings
              </span>
              <div className="space-y-1">
                {/* Service Rate Card Matrix */}
                <button
                  onClick={() => setActiveTab('astro_rates')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'astro_rates'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <Tag className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Service Rate Card Matrix</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {services.length} Rates
                  </span>
                </button>
              </div>
            </div>

            {/* Category 3: CONTENT & MEDIA */}
            <div>
              <span className={`text-[10px] uppercase tracking-wider block px-3 mb-2 font-extrabold ${
                theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-800'
              }`}>
                Content & Media
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('blog')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'blog'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Blog & Articles CMS</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {blogPosts.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'reviews'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Client Reviews CMS</span>
                  {reviews.filter((r) => r.status === 'PENDING').length > 0 ? (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold animate-pulse">
                      {reviews.filter((r) => r.status === 'PENDING').length} New
                    </span>
                  ) : (
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      theme === 'dark' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}>
                      {reviews.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('banner')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'banner'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <Megaphone className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">970x90 Ad Banner CMS</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${bannerAd.active ? 'bg-green-500/20 text-green-700 border-green-500/30' : 'bg-gray-200 text-gray-700 border-gray-300'}`}>
                    {bannerAd.active ? 'LIVE' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('ticker')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'ticker'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#d97706] shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Live Activity Ticker CMS</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {tickerSettings.speedSeconds}s
                  </span>
                </button>
              </div>
            </div>

            {/* Category 4: MANAGEMENT & SETTINGS */}
            <div>
              <span className={`text-[10px] uppercase tracking-wider block px-3 mb-2 font-extrabold ${
                theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-800'
              }`}>
                Management & Settings
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('clients')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'clients'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <Users className="w-4 h-4 text-sky-500 shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Client Directory</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' : 'bg-sky-100 text-sky-900 border-sky-300'
                  }`}>
                    {clientBase.length} Users
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('upi')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'upi' || activeTab === 'settings'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#d97706] shrink-0" />
                  <span className="flex-1 text-center font-bold px-2 leading-tight">Header Support & UPI QR</span>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                    Live Config
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Profile Card */}
        <div className="p-4 border-t border-[#fde68a]">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#fefcf6] border border-[#fde68a]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#d97706] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                ADM
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-xs text-[#0f172a] block truncate">Central Admin</span>
                <span className="text-[10px] text-gray-500 block truncate">admin@kangleiastro.com</span>
              </div>
            </div>
            <button
              onClick={handleAdminLogout}
              className="text-gray-400 hover:text-red-600 transition-colors p-1.5 cursor-pointer"
              title="Lock Admin Panel & Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
         2. MAIN DASHBOARD CONTENT AREA
         ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Control Header Bar */}
        <header className={`h-16 border-b px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300 shadow-md ${
          theme === 'dark' ? 'bg-[#0f172a] border-[#1e293b]' : 'bg-white/95 backdrop-blur-md border-[#f3e8d2]'
        }`}>
          <div className="flex items-center gap-4">
            <div className="relative w-64 md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, astrologers, UTR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-xs font-medium focus:outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-[#1c2541] border-[#3a506b] text-white placeholder-gray-400 focus:border-[#d97706]'
                    : 'bg-[#fefcf6] border-[#fde68a] text-[#0f172a] placeholder-gray-400 focus:border-[#d97706]'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Selector Toggle Option (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#1c2541] text-[#fbbf24] border-[#3a506b] hover:border-[#fbbf24]'
                  : 'bg-slate-100 text-slate-800 border-amber-300 hover:border-amber-500 shadow-xs'
              }`}
              title="Switch Light / Dark Theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="hidden sm:inline font-mono">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700 fill-slate-700" />
                  <span className="hidden sm:inline font-mono">Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={() => setActiveTab('kuthi')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-bold text-xs hover:opacity-95 transition-opacity flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Assign New Kuthi</span>
            </button>
          </div>
        </header>

        {/* Top Horizontal Category Navigation Bar (3-Section Alignment) */}
        <div className={`px-6 py-2.5 border-b sticky top-16 z-20 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-[#0f172a]/95 border-[#1e293b] backdrop-blur-md' : 'bg-[#fefcf6]/95 border-[#fde68a] backdrop-blur-md shadow-xs'
        }`}>
          <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none py-0.5">
            
            {/* 1. LEFT ALIGNED: Core Operations */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#b45309] mr-1 hidden lg:inline">Operations:</span>
              
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('kuthi')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'kuthi'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Kuthi Orders</span>
              </button>

              <button
                onClick={() => setActiveTab('shop_orders')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'shop_orders' || activeTab === 'shop'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#d97706]" />
                <span>E-Store Orders</span>
              </button>

              <button
                onClick={() => setActiveTab('shop_products')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'shop_products'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Products</span>
              </button>

              <button
                onClick={() => setActiveTab('shop_coupons')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'shop_coupons'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-emerald-500" />
                <span>Coupons</span>
              </button>
            </div>

            {/* 2. CENTER ALIGNED: Content & Astrologers */}
            <div className="flex items-center justify-center gap-1.5 mx-auto shrink-0 border-x border-[#fde68a]/50 px-4">
              <button
                onClick={() => setActiveTab('astrologers')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'astrologers'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-purple-400" />
                <span>Astrologers</span>
              </button>

              <button
                onClick={() => setActiveTab('astro_payouts')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'astro_payouts'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-green-500" />
                <span>Payouts</span>
              </button>

              <button
                onClick={() => setActiveTab('astro_services')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'astro_services' || activeTab === 'astro_rates'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                <span>Services</span>
              </button>

              <button
                onClick={() => setActiveTab('blog')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'blog'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>Blog</span>
              </button>

              <button
                onClick={() => setActiveTab('announcements')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'announcements'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                }`}
              >
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>Announcements</span>
              </button>
            </div>

            {/* 3. RIGHT ALIGNED: Admin Tools & Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setActiveTab('shop_delivery')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'shop_delivery'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-sky-500" />
                <span>Logistics</span>
              </button>

              <button
                onClick={() => setActiveTab('clients')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'clients'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Clients</span>
              </button>

              <button
                onClick={() => setActiveTab('navbar')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'navbar'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                }`}
              >
                <Menu className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Navbar Manager</span>
              </button>

              <button
                onClick={() => setActiveTab('upi')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'upi' || activeTab === 'settings'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Header & UPI Config</span>
              </button>
            </div>

          </div>
        </div>

        {/* Dashboard Main Workspace */}
        <main className="p-6 md:p-8 space-y-6">

          {saveAlert && (
            <div className="p-4 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>{saveAlert}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Top 4 Royal Vedic KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]/40 text-[#faf8f4]' : 'bg-white border-[#f3e8d2] text-[#0f172a] shadow-md'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold ${theme === 'dark' ? 'text-[#e0a96d]' : 'text-[#b45309]'}`}>Gross Revenue</span>
                    <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">+30.6%</span>
                  </div>
                  <span className={`text-2xl font-black mb-1 font-mono ${theme === 'dark' ? 'text-[#faf8f4]' : 'text-[#0f172a]'}`}>₹48,950</span>
                  <span className={`text-[10px] ${theme === 'dark' ? 'text-[#5c7a99]' : 'text-gray-500'}`}>Total Kuthi Yengba Collections</span>
                </div>

                <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]/40 text-[#faf8f4]' : 'bg-white border-[#f3e8d2] text-[#0f172a] shadow-md'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold ${theme === 'dark' ? 'text-[#e0a96d]' : 'text-[#b45309]'}`}>Active Astrologers</span>
                    <span className="text-[11px] font-bold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-full border border-[#fde68a]">3 Empaneled</span>
                  </div>
                  <span className={`text-2xl font-black mb-1 ${theme === 'dark' ? 'text-[#faf8f4]' : 'text-[#0f172a]'}`}>{astrologers.length} Gurus</span>
                  <span className={`text-[10px] ${theme === 'dark' ? 'text-[#5c7a99]' : 'text-gray-500'}`}>Ready for Kuthi Assignments</span>
                </div>

                <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]/40 text-[#faf8f4]' : 'bg-white border-[#f3e8d2] text-[#0f172a] shadow-md'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold ${theme === 'dark' ? 'text-[#e0a96d]' : 'text-[#b45309]'}`}>Pending Kuthi Orders</span>
                    <span className="text-[11px] font-bold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-full border border-[#fde68a]">Action Needed</span>
                  </div>
                  <span className={`text-2xl font-black mb-1 ${theme === 'dark' ? 'text-[#faf8f4]' : 'text-[#0f172a]'}`}>
                    {orders.filter(o => o.status !== 'COMPLETED').length} Orders
                  </span>
                  <span className={`text-[10px] ${theme === 'dark' ? 'text-[#5c7a99]' : 'text-gray-500'}`}>Awaiting Astrologer / Client Dispatch</span>
                </div>

                <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]/40 text-[#faf8f4]' : 'bg-white border-[#f3e8d2] text-[#0f172a] shadow-md'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold ${theme === 'dark' ? 'text-[#e0a96d]' : 'text-[#b45309]'}`}>Astrologer Payouts</span>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">₹250 / Kuthi</span>
                  </div>
                  <span className={`text-[10px] ${theme === 'dark' ? 'text-[#5c7a99]' : 'text-gray-500'}`}>Pending Astrologer Payout Pool</span>
                </div>

              </div>

              {/* Multi-Astrologer Workflow Instruction Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#fef3c7] via-[#fde68a] to-[#fef3c7] text-[#0f172a] border border-[#fde68a] shadow-md relative overflow-hidden">
                <div className="max-w-2xl relative z-10">
                  <span className="px-3 py-1 rounded-full bg-white text-[#b45309] font-extrabold text-[10px] uppercase tracking-wider mb-3 inline-block border border-[#fde68a]">
                    ⚡ Centralized Multi-Astrologer Routing Workflow
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-[#b45309] mb-2">How Kuthi Yengba Dispatching Works</h3>
                  <ol className="text-xs text-[#78350f] space-y-2 mt-3 list-decimal list-inside font-sans font-medium">
                    <li><strong>Client Submits Order:</strong> Client uploads Kuthi / birth details & submits UPI UTR on `/booking`.</li>
                    <li><strong>Admin Assigns Astrologer:</strong> Select an empaneled astrologer from the dropdown and click <strong>"Forward Kuthi to Astrologer (WhatsApp)"</strong>.</li>
                    <li><strong>Astrologer Returns Report:</strong> Astrologer analyzes the Kundali and sends the PDF report back to the Central Admin WhatsApp.</li>
                    <li><strong>Admin Delivers to Client:</strong> Click <strong>"Forward Report to Client (WhatsApp)"</strong> to dispatch the finished analysis directly to the client's WhatsApp!</li>
                  </ol>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: KUTHI ORDERS & MULTI-ASTROLOGER ROUTING HUB */}
          {(activeTab === 'dashboard' || activeTab === 'kuthi') && (
            <div className="bg-white rounded-2xl border border-[#f3e8d2] shadow-xl overflow-hidden">
              <div className="p-6 border-b border-[#fde68a] bg-[#fefcf6] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-[#0f172a] text-xl">Kuthi Yengba Orders & Multi-Astrologer Dispatching</h3>
                  <p className="text-xs text-gray-500">Assign orders to astrologers via WhatsApp & deliver finished reports back to clients</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] text-[#b45309] text-xs font-extrabold border border-[#fde68a]">
                    {filteredOrders.length} Total Orders
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans text-[#0f172a]">
                  <thead className="bg-[#fef3c7] text-[#78350f] font-serif font-bold uppercase tracking-wider border-b border-[#fde68a]">
                    <tr>
                      <th className="px-6 py-3.5">Order Ref</th>
                      <th className="px-6 py-3.5">Client & Details</th>
                      <th className="px-6 py-3.5">Kuthi File & Details</th>
                      <th className="px-6 py-3.5">Assign Astrologer</th>
                      <th className="px-6 py-3.5 text-center">Step 1: Forward to Astro</th>
                      <th className="px-6 py-3.5 text-center">Step 2: Astro Status</th>
                      <th className="px-6 py-3.5 text-right">Step 3: Dispatch to Client</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#fde68a]">
                    {filteredOrders.map((o) => {
                      const assignedAstro = astrologers.find(a => a.id === o.assignedAstrologerId);

                      return (
                        <tr key={o.id} className="hover:bg-[#fefcf6] transition-colors">
                          <td className="px-6 py-4 space-y-1.5">
                            <div className="font-mono font-bold text-[#b45309] text-sm">{o.orderRef}</div>
                            <div className="text-[10px] text-gray-500 font-mono">UTR: {o.utr}</div>
                            <div className="pt-1">
                              <select
                                value={o.paymentStatus || (o.status === 'COMPLETED' ? 'PAYMENT_RECEIVED' : 'VERIFICATION_PENDING')}
                                onChange={(e) => handleUpdateKuthiOrderPaymentStatus(o.id, e.target.value)}
                                className={`w-full px-2 py-0.5 rounded text-[10px] font-extrabold border focus:outline-none ${
                                  o.paymentStatus === 'PAYMENT_RECEIVED' || o.status === 'COMPLETED'
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                    : o.paymentStatus === 'PAYMENT_NOT_RECEIVED'
                                    ? 'bg-red-100 text-red-900 border-red-400'
                                    : 'bg-amber-100 text-amber-900 border-amber-400'
                                }`}
                              >
                                <option value="PAYMENT_RECEIVED">🟢 Payment Received (Verified)</option>
                                <option value="PAYMENT_NOT_RECEIVED">🔴 Payment Not Received</option>
                                <option value="VERIFICATION_PENDING">🟡 Verification Pending</option>
                              </select>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-[#0f172a]">{o.clientName} ({o.sex})</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setInspectingOrder(o)}
                              className="group p-2.5 rounded-xl bg-[#fefcf6] hover:bg-[#fef3c7] border border-[#fde68a] text-left w-full cursor-pointer transition-colors"
                            >
                              <span className="font-bold text-[#b45309] text-xs flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5 text-[#d97706]" />
                                <span>View & Download Kuthi</span>
                              </span>
                              {o.kuthiAttached ? (
                                <span className="text-[10px] text-green-700 font-bold block mt-0.5">📄 File Attached: {o.kuthiFileName}</span>
                              ) : (
                                <span className="text-[10px] text-gray-600 block mt-0.5">📅 DOB: {o.dob}</span>
                              )}
                            </button>
                          </td>

                          <td className="px-6 py-4">
                            <select
                              value={o.assignedAstrologerId || ''}
                              onChange={(e) => handleAssignAstrologer(o.id, e.target.value)}
                              className="w-full py-1.5 px-2 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-bold text-[#0f172a] focus:border-[#d97706] focus:outline-none"
                            >
                              <option value="">-- Assign Astrologer --</option>
                              {astrologers.map((astro) => (
                                <option key={astro.id} value={astro.id}>
                                  {astro.name}
                                </option>
                              ))}
                            </select>
                            {o.assignedAstrologerName && (
                              <span className="text-[10px] text-[#b45309] font-bold block mt-1">
                                Guru: {o.assignedAstrologerName}
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-center">
                            {assignedAstro ? (
                              <button
                                onClick={() => handleForwardToAstrologer(o, assignedAstro)}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-white font-extrabold text-[11px] inline-flex items-center gap-1.5 shadow-md transition-all"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Forward to {assignedAstro.name.split(' ')[0]}</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-gray-500 italic">Assign Astrologer First</span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleToggleReportReceived(o.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-all border ${
                                o.reportReceivedFromAstro
                                  ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                  : 'bg-[#0b132b] text-gray-400 border-[#3a506b] hover:text-white'
                              }`}
                            >
                              {o.reportReceivedFromAstro ? '✓ Report Received' : '⏳ Awaiting Astro Report'}
                            </button>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <a
                              href={`https://wa.me/${o.whatsappNo.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(o.clientName)},%20your%20Kuthi%20report%20for%20Order%20${o.orderRef}%20is%20ready.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-[11px] inline-flex items-center gap-1.5 shadow-sm"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Dispatch to Client</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BLOG CMS */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-2xl border border-[#f3e8d2] shadow-sm">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Vedic Astrology Blog & Content Management</h3>
                  <p className="text-xs text-gray-500">Write, edit, publish, and delete blog articles live on `/blog`</p>
                </div>
                <button
                  onClick={() =>
                    setEditingPost({
                      title: '',
                      category: 'Transits & Dashas',
                      excerpt: '',
                      content: '',
                      author: 'Master Astrologer',
                      readTime: '5 min read',
                      status: 'PUBLISHED',
                    })
                  }
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>+ Compose New Article</span>
                </button>
              </div>

              {/* BLOG EDITOR FORM MODAL */}
              {editingPost && (
                <form onSubmit={handleSaveBlogPost} className="bg-white p-6 rounded-3xl border border-[#fde68a] space-y-4 font-sans text-xs shadow-xl">
                  <div className="flex justify-between items-center pb-3 border-b border-[#fde68a]">
                    <h4 className="font-serif font-bold text-xl text-[#0f172a]">
                      {editingPost.id ? 'Edit Blog Article' : 'Compose New Vedic Blog Article'}
                    </h4>
                    <button type="button" onClick={() => setEditingPost(null)} className="p-1.5 text-gray-400 hover:text-gray-600 cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-8">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={editingPost.title || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">Category</label>
                      <select
                        value={editingPost.category || 'Transits & Dashas'}
                        onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs"
                      >
                        <option value="Transits & Dashas">Transits & Dashas</option>
                        <option value="Marriage Compatibility">Marriage Compatibility</option>
                        <option value="Vedic Guidance">Vedic Guidance</option>
                        <option value="Planetary Remedies">Planetary Remedies</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">Article Content</label>
                    <textarea
                      rows={8}
                      required
                      value={editingPost.content || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                      className="w-full p-4 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] text-xs font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setEditingPost(null)} className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs font-bold cursor-pointer">Cancel</button>
                    <button type="submit" className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md cursor-pointer">Publish Live →</button>
                  </div>
                </form>
              )}

              <div className="bg-white rounded-2xl border border-[#f3e8d2] overflow-hidden shadow-md">
                <table className="w-full text-left text-xs font-sans text-[#0f172a]">
                  <thead className="bg-[#fef3c7] text-[#78350f] font-serif font-bold uppercase border-b border-[#fde68a]">
                    <tr>
                      <th className="px-6 py-3.5">Title</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Author</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#fde68a]">
                    {blogPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-[#fefcf6]">
                        <td className="px-6 py-4 font-bold text-[#0f172a] max-w-xs truncate">{post.title}</td>
                        <td className="px-6 py-4 text-[#b45309] font-bold">{post.category}</td>
                        <td className="px-6 py-4 text-gray-600">{post.author}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => setEditingPost(post)} className="px-3 py-1.5 rounded-xl bg-amber-100 text-[#b45309] border border-[#fde68a] text-[10px] font-bold cursor-pointer">Edit</button>
                          <button onClick={() => handleDeletePost(post.id)} className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold cursor-pointer">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4A: E-STORE CLIENT ORDERS HUB */}
          {(activeTab === 'shop_orders' || activeTab === 'shop') && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-3xl border border-[#fde68a] gap-4 shadow-md">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-extrabold uppercase mb-2 border border-[#fde68a]">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#d97706]" />
                    E-Store Orders & Payment Verification
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a]">
                    Client Shipping Orders & UTR Ledger
                  </h3>
                  <p className="text-xs text-gray-500">
                    Inspect 12-digit UTR payments, verify buyer address, update order status, and assign courier dispatch.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('shop_delivery')}
                  className="px-5 py-2.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] border border-[#fde68a] text-[#b45309] font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-[#d97706]" />
                  <span>Go to Courier Delivery Hub →</span>
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#fde68a] space-y-1 shadow-xs">
                  <span className="text-xs text-gray-500 font-bold block uppercase">Total Orders</span>
                  <span className="text-2xl font-serif font-extrabold text-[#b45309]">{shopOrders.length}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-green-300 space-y-1 shadow-xs">
                  <span className="text-xs text-green-700 font-bold block uppercase">Paid / Verified</span>
                  <span className="text-2xl font-serif font-extrabold text-green-700">
                    {shopOrders.filter((o) => o.status === 'PAID').length}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-blue-300 space-y-1 shadow-xs">
                  <span className="text-xs text-blue-700 font-bold block uppercase">Dispatched</span>
                  <span className="text-2xl font-serif font-extrabold text-blue-700">
                    {shopOrders.filter((o) => o.status === 'DISPATCHED').length}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-purple-300 space-y-1 shadow-xs">
                  <span className="text-xs text-purple-700 font-bold block uppercase">Total Revenue</span>
                  <span className="text-2xl font-serif font-extrabold text-purple-700 font-mono">
                    ₹{shopOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CLIENT STORE ORDERS TABLE */}
              <div className="bg-white rounded-3xl border border-[#fde68a] overflow-hidden shadow-xl">
                <div className="p-5 border-b border-[#fde68a] bg-[#fefcf6] flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#b45309]">E-Store Orders Directory ({shopOrders.length})</h4>
                    <p className="text-xs text-gray-500">Review buyer information and click "Assign Delivery" to generate tracking</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans text-[#0f172a]">
                    <thead className="bg-[#fef3c7] text-[#78350f] uppercase tracking-wider font-extrabold border-b border-[#fde68a]">
                      <tr>
                        <th className="p-4">Order Ref & Date</th>
                        <th className="p-4">Buyer Details</th>
                        <th className="p-4">Shipping Address</th>
                        <th className="p-4">Items Ordered</th>
                        <th className="p-4">Total Amount & UTR</th>
                        <th className="p-4">Order Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#fde68a]">
                      {shopOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-400 font-medium">
                            No store orders placed yet.
                          </td>
                        </tr>
                      ) : (
                        shopOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-[#fefcf6] transition-colors">
                            <td className="p-4">
                              <div className="font-mono font-extrabold text-[#b45309] text-xs">{ord.orderRef}</div>
                              <div className="text-gray-500 text-[10px]">{ord.orderedAt}</div>
                            </td>
                            <td className="p-4">
                              <div className="font-extrabold text-[#0f172a]">{ord.buyerName}</div>
                              <div className="text-[#b45309] font-mono text-[11px]">{ord.whatsappNo || ord.mobile}</div>
                            </td>
                            <td className="p-4 max-w-xs text-gray-700">
                              <div className="line-clamp-2">{ord.address}</div>
                              <span className="font-mono text-[10px] text-gray-500">PIN: {ord.pincode}</span>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                {ord.items.map((it, iIdx) => (
                                  <div key={iIdx} className="text-slate-800 font-medium">
                                    • {it.title} <span className="text-[#b45309] font-bold">x{it.quantity}</span>
                                    {it.sellerName && (
                                      <span className="text-[10px] text-[#b45309] block font-bold font-mono pl-3">
                                        Seller: {it.sellerName} (Comm: {it.adminCommissionPct ?? 15}%)
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-mono font-extrabold text-emerald-400 text-sm">₹{ord.totalAmount.toLocaleString()}</div>
                              <div className="text-gray-400 text-[10px] font-mono">UTR: {ord.utr}</div>
                            </td>
                            <td className="p-4 space-y-2">
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-gray-600 uppercase block">Delivery Status</span>
                                <select
                                  value={ord.status}
                                  onChange={(e) => handleUpdateShopOrderStatus(ord.id, e.target.value)}
                                  className={`w-full px-2 py-1 rounded-lg text-[11px] font-extrabold border focus:outline-none ${
                                    ord.status === 'PAID'
                                      ? 'bg-green-100 text-green-900 border-green-300'
                                      : ord.status === 'DISPATCHED'
                                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                                      : ord.status === 'DELIVERED'
                                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                                      : 'bg-amber-100 text-amber-900 border-amber-300'
                                  }`}
                                >
                                  <option value="PAID">PAID (Order Confirmed)</option>
                                  <option value="DISPATCHED">DISPATCHED (In Transit)</option>
                                  <option value="DELIVERED">DELIVERED</option>
                                  <option value="PAYMENT_PENDING">PAYMENT PENDING</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-[#b45309] uppercase block">Payment Verification</span>
                                <select
                                  value={ord.paymentStatus || (ord.status === 'PAID' || ord.status === 'DELIVERED' || ord.status === 'DISPATCHED' ? 'PAYMENT_RECEIVED' : 'VERIFICATION_PENDING')}
                                  onChange={(e) => handleUpdateShopOrderPaymentStatus(ord.id, e.target.value)}
                                  className={`w-full px-2 py-1 rounded-lg text-[11px] font-extrabold border focus:outline-none ${
                                    ord.paymentStatus === 'PAYMENT_RECEIVED' || (ord.status === 'PAID' || ord.status === 'DELIVERED' || ord.status === 'DISPATCHED')
                                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                      : ord.paymentStatus === 'PAYMENT_NOT_RECEIVED'
                                      ? 'bg-red-100 text-red-900 border-red-400'
                                      : 'bg-amber-100 text-amber-900 border-amber-400'
                                  }`}
                                >
                                  <option value="PAYMENT_RECEIVED">🟢 Payment Received (Verified)</option>
                                  <option value="PAYMENT_NOT_RECEIVED">🔴 Payment Not Received</option>
                                  <option value="VERIFICATION_PENDING">🟡 Verification Pending</option>
                                </select>
                              </div>
                            </td>
                            <td className="p-4 text-center space-y-1">
                              <button
                                onClick={() => {
                                  setAssignDeliveryModalOrder(ord);
                                  setDeliveryForm({
                                    courierPartner: ord.courierPartner || 'BlueDart Express',
                                    trackingNumber: ord.trackingNumber || 'BD-' + Math.floor(10000000 + Math.random() * 90000000) + 'IN',
                                    deliveryAgentPhone: ord.deliveryAgentPhone || '+91 98620 11223',
                                    expectedDeliveryDate: ord.expectedDeliveryDate || '2026-08-30',
                                  });
                                }}
                                className="w-full px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-[10px] flex items-center justify-center gap-1 shadow-sm hover:opacity-95"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Assign Delivery</span>
                              </button>

                              {ord.items.some((it: any) => it.sellerType === 'ASTROLOGER') && (
                                <button
                                  onClick={() => handleConfirmAstroOrder(ord.id)}
                                  className={`w-full px-3 py-1 rounded-xl text-[10px] font-extrabold border transition-colors cursor-pointer ${
                                    ord.adminConfirmed
                                      ? 'bg-green-600/30 text-green-300 border-green-500/40'
                                      : 'bg-purple-600/40 hover:bg-purple-600 text-purple-200 border-purple-500/50'
                                  }`}
                                >
                                  {ord.adminConfirmed ? '✓ Astrologer Sale Confirmed' : '✅ Confirm Astrologer Sale'}
                                </button>
                              )}

                              <a
                                href={`https://wa.me/${(ord.whatsappNo || ord.mobile).replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(ord.buyerName)},%20your%20KangleiAstro%20Store%20Order%20${ord.orderRef}%20is%20confirmed!`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-3 py-1 rounded-xl bg-green-600/30 hover:bg-green-600 text-green-300 hover:text-white border border-green-500/40 font-bold text-[10px] inline-flex items-center justify-center gap-1 transition-colors"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>WhatsApp Client</span>
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4B: ADD & EDIT PRODUCTS CATALOG HUB */}
          {activeTab === 'shop_products' && (
            <div className="space-y-6">
              {/* PLATFORM COMMISSION SETTINGS CARD */}
              <div className="bg-white p-6 rounded-3xl border border-[#fde68a] flex flex-wrap items-center justify-between gap-4 shadow-md">
                <div className="space-y-1 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] text-[10px] font-extrabold uppercase border border-[#fde68a]">
                    <DollarSign className="w-3 h-3 text-[#d97706]" />
                    Astrologer Marketplace Commission Rate
                  </div>
                  <h4 className="font-serif font-bold text-lg text-[#0f172a]">Platform Commission Settings</h4>
                  <p className="text-xs text-gray-500">
                    Set the default commission % deducted by Admin on products sold by empaneled astrologers. (Currently set to <strong className="text-[#b45309] font-mono">{commissionSettings.defaultCommissionPct}%</strong>).
                  </p>
                </div>

                <form onSubmit={handleUpdateCommissionRate} className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editingCommissionPct}
                      onChange={(e) => setEditingCommissionPct(Number(e.target.value))}
                      className="w-24 h-10 px-3 pr-7 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-mono font-bold text-sm text-center"
                    />
                    <span className="absolute right-3 top-2.5 font-bold text-gray-400 text-xs">%</span>
                  </div>
                  <button
                    type="submit"
                    className="px-5 h-10 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 cursor-pointer"
                  >
                    Save Commission Rate %
                  </button>
                </form>
              </div>

              {/* PENDING ASTROLOGER SUBMISSIONS TABLE */}
              {shopProducts.some((p) => p.status === 'PENDING_APPROVAL') && (
                <div className="bg-white rounded-3xl border border-amber-300 shadow-xl overflow-hidden">
                  <div className="p-6 bg-amber-50 border-b border-amber-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-serif font-bold text-xl text-[#b45309] flex items-center gap-2">
                        <span>⏳ Pending Astrologer Product Submissions</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-[#78350f] text-xs font-mono font-bold">
                          {shopProducts.filter((p) => p.status === 'PENDING_APPROVAL').length}
                        </span>
                      </h4>
                      <p className="text-xs text-amber-800">Review items submitted by astrologers before publishing live on the store.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs text-[#0f172a]">
                      <thead>
                        <tr className="bg-[#fef3c7] border-b border-[#fde68a] text-[#78350f] font-serif uppercase">
                          <th className="p-4">Vendor Astrologer</th>
                          <th className="p-4">Product Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price (₹)</th>
                          <th className="p-4">Admin Commission</th>
                          <th className="p-4">Astrologer Payout</th>
                          <th className="p-4 text-center">Admin Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#fde68a]">
                        {shopProducts
                          .filter((p) => p.status === 'PENDING_APPROVAL')
                          .map((p) => {
                            const commPct = p.adminCommissionPct ?? commissionSettings.defaultCommissionPct;
                            const commAmt = Math.round((p.price * commPct) / 100);
                            const netPayout = p.price - commAmt;
                            return (
                              <tr key={p.id} className="hover:bg-[#fefcf6]">
                                <td className="p-4 font-bold text-[#b45309]">{p.sellerName || 'Empaneled Astrologer'}</td>
                                <td className="p-4 font-extrabold text-[#0f172a]">{p.title}</td>
                                <td className="p-4 text-gray-600">{p.category}</td>
                                <td className="p-4 font-mono font-bold text-[#0f172a]">₹{p.price.toLocaleString()}</td>
                                <td className="p-4 font-mono text-[#b45309]">₹{commAmt} ({commPct}%)</td>
                                <td className="p-4 font-mono font-bold text-emerald-700">₹{netPayout.toLocaleString()}</td>
                                <td className="p-4 text-center space-x-2">
                                  <button
                                    onClick={() => handleApproveProduct(p.id)}
                                    className="px-3.5 py-1.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs shadow-md cursor-pointer"
                                  >
                                    ✅ Approve & Publish
                                  </button>
                                  <button
                                    onClick={() => handleRejectProduct(p.id)}
                                    className="px-3.5 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs cursor-pointer border border-red-300"
                                  >
                                    ❌ Reject
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-3xl border border-[#fde68a] gap-4 shadow-md">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-extrabold uppercase mb-2 border border-[#fde68a]">
                    <Package className="w-3.5 h-3.5 text-[#d97706]" />
                    Product Catalog & Stock Management
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a]">
                    Add, Edit & Update E-Store Products
                  </h3>
                  <p className="text-xs text-gray-500">
                    Add new gemstones, books, yantras, or puja items, update selling prices, stock inventory, and lab certificate badges.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-sm">
                    <Download className="w-4 h-4 rotate-180" />
                    <span>📥 Import CSV/TSV</span>
                    <input
                      type="file"
                      accept=".csv,.tsv,.txt"
                      onChange={handleImportCSVFile}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={handleExportProductsCSV}
                    className="px-4 py-3 rounded-xl bg-[#0b132b] hover:bg-[#1c2541] text-amber-300 border border-[#d97706] font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>📤 Export CSV</span>
                  </button>

                  <button
                    onClick={() => setShowCategoryManagerModal(true)}
                    className="px-4 py-3 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] border border-[#fde68a] text-[#b45309] font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Tag className="w-4 h-4 text-[#d97706]" />
                    <span>Categories ({shopCategories.length})</span>
                  </button>

                  <button
                    onClick={() =>
                      setEditingProduct({
                        title: '',
                        category: shopCategories[0] || 'Precious Gemstones > Ruby',
                        price: 45000,
                        originalPrice: 55000,
                        stock: 5,
                        badge: '100% NATURAL',
                        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
                        description: 'Authentic unheated natural gemstone certified for Vedic astrology.',
                      })
                    }
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Product</span>
                  </button>
                </div>
              </div>

              {/* PRODUCT EDIT FORM MODAL */}
              {editingProduct && (
                <form onSubmit={handleSaveProduct} className="bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] space-y-4 text-xs font-sans text-white shadow-2xl">
                  <div className="flex justify-between items-center pb-3 border-b border-[#3a506b]">
                    <h4 className="font-serif font-bold text-xl text-[#fbbf24]">
                      {editingProduct.id ? 'Edit Product Details' : 'Add New E-Store Product'}
                    </h4>
                    <button type="button" onClick={() => setEditingProduct(null)} className="p-1 text-gray-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-8">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Natural Ceylon Yellow Sapphire (Pukhraj)"
                        value={editingProduct.title || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d]">
                          Category *
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowInlineNewCategory(!showInlineNewCategory)}
                          className="text-[10px] font-bold text-[#fbbf24] hover:underline"
                        >
                          {showInlineNewCategory ? 'Cancel' : '+ New Category'}
                        </button>
                      </div>

                      {showInlineNewCategory ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Category name..."
                            value={newCategoryInput}
                            onChange={(e) => setNewCategoryInput(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white text-xs font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddCategory()}
                            className="px-3 h-10 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <select
                          value={editingProduct.category || shopCategories[0] || 'Gemstones'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs"
                        >
                          {shopCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">Selling Price (₹) *</label>
                      <input
                        type="number"
                        required
                        placeholder="6999"
                        value={editingProduct.price || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-[#fbbf24] font-mono font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">Original MRP Price (₹)</label>
                      <input
                        type="number"
                        placeholder="8999"
                        value={editingProduct.originalPrice || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-gray-300 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">Available Stock Count *</label>
                      <input
                        type="number"
                        required
                        placeholder="10"
                        value={editingProduct.stock ?? 10}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-green-400 font-mono font-bold text-xs"
                      />
                    </div>
                  </div>

                  {/* Badge & Image Upload Section */}
                  <div className="space-y-3 p-4 rounded-2xl bg-[#0b132b] border border-[#3a506b]/60">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                          Badge Tag Label
                        </label>
                        <input
                          type="text"
                          placeholder="Lab Certified 100% Original"
                          value={editingProduct.badge || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                          className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#1c2541] text-amber-300 font-bold text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                          📁 Upload Product Photo from Device *
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductImageFileUpload}
                          className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#d97706] file:text-white hover:file:opacity-90 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2 border-t border-[#3a506b]/40">
                      <div className="sm:col-span-8">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                          🌐 Or Paste Image Web URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={editingProduct.image || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#1c2541] text-sky-300 font-mono text-xs"
                        />
                      </div>

                      {/* Live Image Preview Thumbnail Box */}
                      <div className="sm:col-span-4 flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl bg-cover bg-center border border-[#fbbf24] shadow-md shrink-0 bg-[#1c2541] flex items-center justify-center overflow-hidden" style={{ backgroundImage: editingProduct.image ? `url(${editingProduct.image})` : undefined }}>
                          {!editingProduct.image && <ImageIcon className="w-6 h-6 text-gray-500" />}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#fbbf24] block uppercase">Live Preview</span>
                          <span className="text-[9px] text-gray-400 block line-clamp-1">{editingProduct.image ? 'Photo Loaded' : 'No photo chosen'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">Product Description Copy</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Detailed description of the product..."
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-gray-200 text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2 border-t border-[#3a506b]">
                    <button type="button" onClick={() => setEditingProduct(null)} className="px-5 py-2.5 rounded-xl bg-[#0b132b] text-gray-300 text-xs font-bold border border-[#3a506b]">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md">Save Product Live →</button>
                  </div>
                </form>
              )}

              {/* PRODUCT INVENTORY CATALOG TABLE */}
              <div className="bg-white rounded-3xl border border-[#fde68a] overflow-hidden shadow-xl">
                <div className="p-5 border-b border-[#fde68a] bg-[#fefcf6] flex justify-between items-center">
                  <h4 className="font-serif font-bold text-lg text-[#b45309]">E-Store Product Catalog ({shopProducts.length} Items)</h4>
                  <span className="text-xs text-gray-500">Click edit to update price, stock, or description</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans text-[#0f172a]">
                    <thead className="bg-[#fef3c7] text-[#78350f] font-serif font-bold uppercase border-b border-[#fde68a]">
                      <tr>
                        <th className="px-6 py-3.5">Product Title</th>
                        <th className="px-6 py-3.5">Category</th>
                        <th className="px-6 py-3.5">Selling Price</th>
                        <th className="px-6 py-3.5">Stock</th>
                        <th className="px-6 py-3.5">Badge</th>
                        <th className="px-6 py-3.5 text-center">Home Feature</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#fde68a]">
                      {shopProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-[#fefcf6]">
                          <td className="px-6 py-4">
                            <div className="font-bold text-[#0f172a] text-sm">{prod.title}</div>
                            <div className="text-gray-500 text-[10px] line-clamp-1">{prod.description}</div>
                          </td>
                          <td className="px-6 py-4 text-[#b45309] font-bold">{prod.category}</td>
                          <td className="px-6 py-4 font-mono font-bold text-[#b45309]">
                            ₹{prod.price.toLocaleString()}
                            <span className="text-gray-400 line-through text-[10px] block font-normal">₹{prod.originalPrice.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 font-mono text-green-700 font-extrabold">{prod.stock} units</td>
                          <td className="px-6 py-4 text-[#d97706] text-[10px] font-extrabold uppercase">{prod.badge}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleToggleProductFeatured(prod.id)}
                              className={`px-3 py-1 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${
                                prod.isFeatured
                                  ? 'bg-[#fef3c7] text-[#b45309] border-[#fde68a] shadow-xs'
                                  : 'bg-white text-gray-500 border-gray-300 hover:text-gray-800'
                              }`}
                            >
                              {prod.isFeatured ? '⭐ Featured' : '+ Feature'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button onClick={() => setEditingProduct(prod)} className="px-3 py-1.5 rounded-xl bg-amber-100 text-[#b45309] border border-[#fde68a] text-[10px] font-bold cursor-pointer">Edit</button>
                            <button onClick={() => handleDeleteProduct(prod.id)} className="px-3 py-1.5 rounded-xl bg-red-100 text-red-700 border border-red-200 text-[10px] font-bold cursor-pointer">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4D: DEDICATED ASTROLOGER VENDOR PRODUCTS & COMMISSION WORKSPACE */}
          {activeTab === 'shop_astro_products' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="flex flex-wrap justify-between items-center bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] gap-4 shadow-xl">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-extrabold uppercase mb-2 border border-purple-500/30">
                    <Award className="w-3.5 h-3.5 text-purple-400" />
                    Astrologer Vendor Submissions & Marketplace Controls
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-[#faf8f4]">
                    Astrologer Vendor Products & Verification Hub
                  </h3>
                  <p className="text-xs text-gray-400">
                    Inspect consecrated remedies submitted by empaneled astrologers, configure platform commission rates, and manage live vendor product listings.
                  </p>
                </div>
              </div>

              {/* PLATFORM COMMISSION SETTINGS CARD */}
              <div className="bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] flex flex-wrap items-center justify-between gap-4 shadow-lg">
                <div className="space-y-1 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#fbbf24]/20 text-[#fbbf24] text-[10px] font-extrabold uppercase border border-[#fbbf24]/30">
                    <DollarSign className="w-3 h-3" />
                    Astrologer Marketplace Commission Rate
                  </div>
                  <h4 className="font-serif font-bold text-lg text-white">Platform Commission Settings</h4>
                  <p className="text-xs text-gray-400">
                    Set the default commission % deducted by Admin on products sold by empaneled astrologers. (Currently set to <strong className="text-[#fbbf24] font-mono">{commissionSettings.defaultCommissionPct}%</strong>).
                  </p>
                </div>

                <form onSubmit={handleUpdateCommissionRate} className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editingCommissionPct}
                      onChange={(e) => setEditingCommissionPct(Number(e.target.value))}
                      className="w-24 h-10 px-3 pr-7 rounded-xl border border-[#3a506b] bg-[#0b132b] text-[#fbbf24] font-mono font-bold text-sm text-center"
                    />
                    <span className="absolute right-3 top-2.5 font-bold text-gray-400 text-xs">%</span>
                  </div>
                  <button
                    type="submit"
                    className="px-5 h-10 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 cursor-pointer"
                  >
                    Save Commission Rate %
                  </button>
                </form>
              </div>

              {/* PENDING ASTROLOGER SUBMISSIONS TABLE */}
              <div className="bg-[#1c2541] rounded-3xl border border-amber-500/50 shadow-xl overflow-hidden">
                <div className="p-6 bg-amber-500/10 border-b border-amber-500/30 flex justify-between items-center">
                  <div>
                    <h4 className="font-serif font-bold text-xl text-[#fbbf24] flex items-center gap-2">
                      <span>⏳ Pending Astrologer Product Submissions</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                        {shopProducts.filter((p) => p.sellerType === 'ASTROLOGER' && p.status === 'PENDING_APPROVAL').length}
                      </span>
                    </h4>
                    <p className="text-xs text-amber-200/80">Review items submitted by astrologers before publishing live on the store.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0b132b] border-b border-[#3a506b] text-[#fbbf24] font-serif uppercase">
                        <th className="p-4">Vendor Astrologer</th>
                        <th className="p-4">Product Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price (₹)</th>
                        <th className="p-4">Admin Commission</th>
                        <th className="p-4">Astrologer Payout</th>
                        <th className="p-4 text-center">Admin Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3a506b]/50">
                      {shopProducts.filter((p) => p.sellerType === 'ASTROLOGER' && p.status === 'PENDING_APPROVAL').length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-400 font-medium">
                            No pending astrologer submissions awaiting approval right now.
                          </td>
                        </tr>
                      ) : (
                        shopProducts
                          .filter((p) => p.sellerType === 'ASTROLOGER' && p.status === 'PENDING_APPROVAL')
                          .map((p) => {
                            const commPct = p.adminCommissionPct ?? commissionSettings.defaultCommissionPct;
                            const commAmt = Math.round((p.price * commPct) / 100);
                            const netPayout = p.price - commAmt;
                            return (
                              <tr key={p.id} className="hover:bg-[#0b132b]/40">
                                <td className="p-4 font-bold text-amber-300">{p.sellerName || 'Empaneled Astrologer'}</td>
                                <td className="p-4 font-extrabold text-white">{p.title}</td>
                                <td className="p-4 text-gray-300">{p.category}</td>
                                <td className="p-4 font-mono font-bold text-white">₹{p.price.toLocaleString()}</td>
                                <td className="p-4 font-mono text-amber-300">₹{commAmt} ({commPct}%)</td>
                                <td className="p-4 font-mono font-bold text-emerald-400">₹{netPayout.toLocaleString()}</td>
                                <td className="p-4 text-center space-x-2">
                                  <button
                                    onClick={() => handleApproveProduct(p.id)}
                                    className="px-3.5 py-1.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs shadow-md cursor-pointer"
                                  >
                                    ✅ Approve & Publish
                                  </button>
                                  <button
                                    onClick={() => handleRejectProduct(p.id)}
                                    className="px-3.5 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white font-bold text-xs cursor-pointer"
                                  >
                                    ❌ Reject
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* APPROVED ASTROLOGER PRODUCTS CATALOG TABLE */}
              <div className="bg-[#1c2541] rounded-3xl border border-[#3a506b] overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#3a506b] flex justify-between items-center">
                  <h4 className="font-serif font-bold text-xl text-purple-300">
                    Approved Astrologer Vendor Products ({shopProducts.filter((p) => p.sellerType === 'ASTROLOGER' && p.status === 'APPROVED').length})
                  </h4>
                  <span className="text-xs text-gray-400">Products live on public store `/shop`</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0b132b] border-b border-[#3a506b] text-[#fbbf24] font-serif uppercase">
                        <th className="p-4">Vendor Name</th>
                        <th className="p-4">Product Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price (₹)</th>
                        <th className="p-4">Admin Commission</th>
                        <th className="p-4">Astrologer Payout</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 text-center">Home Feature</th>
                        <th className="p-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3a506b]/50">
                      {shopProducts.filter((p) => p.sellerType === 'ASTROLOGER' && p.status === 'APPROVED').length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-gray-400 font-medium">
                            No approved astrologer products in catalog yet.
                          </td>
                        </tr>
                      ) : (
                        shopProducts
                          .filter((p) => p.sellerType === 'ASTROLOGER' && p.status === 'APPROVED')
                          .map((p) => {
                            const commPct = p.adminCommissionPct ?? commissionSettings.defaultCommissionPct;
                            const commAmt = Math.round((p.price * commPct) / 100);
                            const netPayout = p.price - commAmt;
                            return (
                              <tr key={p.id} className="hover:bg-[#0b132b]/40">
                                <td className="p-4 font-bold text-amber-300">{p.sellerName}</td>
                                <td className="p-4 font-extrabold text-white">{p.title}</td>
                                <td className="p-4 text-gray-300">{p.category}</td>
                                <td className="p-4 font-mono font-bold text-[#fbbf24]">₹{p.price.toLocaleString()}</td>
                                <td className="p-4">
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      defaultValue={commPct}
                                      onBlur={(e) => handleUpdateSingleProductCommission(p.id, Number(e.target.value))}
                                      className="w-14 h-7 px-2 rounded-lg bg-[#0b132b] border border-[#3a506b] text-[#fbbf24] text-xs font-mono font-bold text-center"
                                    />
                                    <span className="text-gray-400 font-mono text-[10px]">%</span>
                                  </div>
                                  <span className="text-[10px] text-gray-400 font-mono block">Fee: ₹{commAmt}</span>
                                </td>
                                <td className="p-4 font-mono font-bold text-emerald-400">₹{netPayout.toLocaleString()}</td>
                                <td className="p-4 font-mono text-gray-300">{p.stock} units</td>
                                <td className="p-4 text-center">
                                  <button
                                    onClick={() => handleToggleProductFeatured(p.id)}
                                    className={`px-3 py-1 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${
                                      p.isFeatured
                                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                                        : 'bg-[#0b132b] text-gray-400 border-[#3a506b] hover:text-white'
                                    }`}
                                  >
                                    {p.isFeatured ? '⭐ Featured' : '+ Feature'}
                                  </button>
                                </td>
                                <td className="p-4 text-center">
                                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-[10px] font-extrabold border border-green-500/30">
                                    ✅ Live on Shop
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4D: PROMO COUPONS & DISCOUNTS MANAGER */}
          {activeTab === 'shop_coupons' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="flex flex-wrap justify-between items-center bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] gap-4 shadow-xl">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase mb-2 border border-emerald-500/30">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    E-Store Promo Coupons & Discount Vouchers
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-[#faf8f4]">
                    Promo Coupons Engine & Offer Management
                  </h3>
                  <p className="text-xs text-gray-400">
                    Create percentage discounts, flat cash back vouchers, and free shipping codes for your store buyers.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingCoupon({
                      code: '',
                      type: 'PERCENTAGE',
                      value: 10,
                      minOrderAmount: 499,
                      active: true,
                    });
                    setShowCouponModal(true);
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create Promo Coupon</span>
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-[#1c2541] border border-[#3a506b] space-y-1 shadow-md">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Total Promo Codes</span>
                  <span className="text-2xl font-black text-[#fbbf24] font-mono">{shopCoupons.length}</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#1c2541] border border-emerald-500/40 space-y-1 shadow-md">
                  <span className="text-xs text-emerald-400 font-bold uppercase block">Active Vouchers</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {shopCoupons.filter((c) => c.active !== false).length}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#1c2541] border border-sky-500/40 space-y-1 shadow-md">
                  <span className="text-xs text-sky-400 font-bold uppercase block">Total Times Redeemed</span>
                  <span className="text-2xl font-black text-sky-400 font-mono">
                    {shopCoupons.reduce((sum, c) => sum + (c.usageCount || 0), 0)} Redemptions
                  </span>
                </div>
              </div>

              {/* COUPONS DIRECTORY TABLE */}
              <div className="bg-[#1c2541] rounded-3xl border border-[#3a506b] overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#3a506b] flex justify-between items-center">
                  <h4 className="font-serif font-bold text-xl text-emerald-300">
                    Active & Available Vouchers ({shopCoupons.length})
                  </h4>
                  <span className="text-xs text-gray-400">Validated live on checkout drawer & cart</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0b132b] border-b border-[#3a506b] text-[#fbbf24] font-serif uppercase">
                        <th className="p-4">Coupon Code</th>
                        <th className="p-4">Discount Benefit</th>
                        <th className="p-4">Minimum Order (₹)</th>
                        <th className="p-4">Times Redeemed</th>
                        <th className="p-4 text-center">Active Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3a506b]/50">
                      {shopCoupons.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
                            No promo coupons configured yet. Click "+ Create Promo Coupon" to add one.
                          </td>
                        </tr>
                      ) : (
                        shopCoupons.map((coupon) => (
                          <tr key={coupon.id} className="hover:bg-[#0b132b]/40">
                            <td className="p-4">
                              <code className="px-3 py-1 rounded-xl bg-[#0b132b] border border-[#d97706] text-[#fbbf24] font-mono font-black text-sm tracking-wider">
                                {coupon.code}
                              </code>
                            </td>
                            <td className="p-4 font-bold text-white">
                              {coupon.type === 'PERCENTAGE' && (
                                <span className="text-emerald-400">{coupon.value}% OFF Subtotal</span>
                              )}
                              {coupon.type === 'FLAT' && (
                                <span className="text-amber-400">₹{coupon.value} FLAT Cash Discount</span>
                              )}
                              {coupon.type === 'FREE_SHIPPING' && (
                                <span className="text-sky-400">FREE Nationwide Express Delivery</span>
                              )}
                            </td>
                            <td className="p-4 font-mono font-bold text-gray-300">
                              ₹{coupon.minOrderAmount}
                            </td>
                            <td className="p-4 font-mono text-gray-400">
                              {coupon.usageCount || 0} times
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleToggleCouponActive(coupon)}
                                className={`px-3 py-1 rounded-full text-[10px] font-extrabold border transition-all cursor-pointer ${
                                  coupon.active !== false
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : 'bg-red-500/20 text-red-300 border-red-500/40'
                                }`}
                              >
                                {coupon.active !== false ? 'ACTIVE' : 'INACTIVE'}
                              </button>
                            </td>
                            <td className="p-4 text-center space-x-2">
                              <button
                                onClick={() => {
                                  setEditingCoupon(coupon);
                                  setShowCouponModal(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-[#3a506b] hover:bg-[#4a6585] text-white font-bold text-xs cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                                className="px-3 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white font-bold text-xs cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4E: ANIMATED SHOP HERO SLIDERS CMS */}
          {activeTab === 'shop_sliders' && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] gap-4 shadow-xl">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b45309]/30 text-[#fbbf24] text-xs font-extrabold uppercase mb-2 border border-[#fbbf24]">
                    <ImageIcon className="w-3.5 h-3.5 text-[#fbbf24]" />
                    E-Store Hero Sliders &amp; Product Banners
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-white">
                    Shop Hero Banner &amp; Product Sliders CMS
                  </h3>
                  <p className="text-xs text-gray-400">
                    Control animated product hero slider banners displayed at the top of /shop. Add images, badges, titles, descriptions &amp; CTA links.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingSlider({
                      badge: '✨ AUTHENTIC MANIPURI & VEDIC CONSECRATED STORE',
                      title: '',
                      highlightText: '',
                      subtitle: '',
                      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
                      ctaText: 'Shop Consecrated Gemstones',
                      ctaLink: '/shop',
                      bgColor: 'from-[#0b132b] via-[#1c2541] to-[#0b132b]',
                      active: true,
                      displayOrder: shopSliders.length + 1,
                    });
                    setShowSliderModal(true);
                  }}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:opacity-95 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create New Hero Slider</span>
                </button>
              </div>

              {/* SLIDERS LIST GRID */}
              <div className="grid grid-cols-1 gap-6">
                {shopSliders.length === 0 ? (
                  <div className="p-12 text-center bg-[#1c2541] rounded-3xl border border-[#3a506b] space-y-3">
                    <ImageIcon className="w-12 h-12 text-[#d97706] mx-auto opacity-50" />
                    <h4 className="font-serif font-bold text-xl text-white">No Shop Hero Sliders Found</h4>
                    <p className="text-xs text-gray-400 max-w-md mx-auto">
                      Click &quot;+ Create New Hero Slider&quot; to add your first animated product hero slide to /shop.
                    </p>
                  </div>
                ) : (
                  shopSliders.map((slider, idx) => (
                    <div
                      key={slider.id || idx}
                      className={`relative rounded-3xl border overflow-hidden p-6 sm:p-8 space-y-4 shadow-xl transition-all ${
                        slider.active
                          ? 'bg-[#1c2541] border-[#d97706]'
                          : 'bg-[#0b132b] border-[#3a506b] opacity-60'
                      }`}
                    >
                      {/* Top Header info */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#3a506b] pb-4">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-[#0b132b] border border-[#d97706] text-[#fbbf24] text-xs font-mono font-black">
                            SLIDE #{slider.displayOrder || (idx + 1)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                            slider.active
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}>
                            {slider.active ? '● LIVE ON /SHOP' : '○ DISABLED (HIDDEN)'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleSlider(slider.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer border transition-colors ${
                              slider.active
                                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            {slider.active ? 'Disable Slide' : 'Enable Slide'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingSlider(slider);
                              setShowSliderModal(true);
                            }}
                            className="px-4 py-1.5 rounded-xl bg-[#3a506b] hover:bg-[#4a6585] text-white font-bold text-xs cursor-pointer"
                          >
                            Edit Slide
                          </button>
                          <button
                            onClick={() => handleDeleteSlider(slider.id, slider.title)}
                            className="px-3 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white font-bold text-xs cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-8 space-y-2">
                          <div className="inline-block px-3 py-1 rounded-md bg-[#b45309]/30 text-[#fbbf24] text-[10px] font-extrabold uppercase">
                            {slider.badge}
                          </div>
                          <h4 className="font-serif font-black text-xl sm:text-2xl text-white">
                            {slider.title}{' '}
                            <span className="text-[#fbbf24] underline decoration-[#b45309]">
                              {slider.highlightText}
                            </span>
                          </h4>
                          <p className="text-xs text-gray-300 font-serif italic max-w-xl">
                            {slider.subtitle}
                          </p>
                          <div className="pt-2 flex items-center gap-3 text-xs text-amber-400 font-mono font-bold">
                            <span>Button: &quot;{slider.ctaText}&quot;</span>
                            <span>→</span>
                            <span className="text-sky-300">{slider.ctaLink}</span>
                          </div>
                        </div>

                        {slider.image && (
                          <div className="md:col-span-4 flex justify-end">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#fbbf24] shadow-lg bg-slate-900 shrink-0">
                              <img src={slider.image} alt={slider.title} className="w-full h-full object-cover" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: DEDICATED ASTROLOGER ANNOUNCEMENTS & PROMO ADS WORKSPACE */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="flex flex-wrap justify-between items-center bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] gap-4 shadow-xl">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold uppercase mb-2 border border-amber-500/30">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    Astrologer Broadcast Center & Notice Board CMS
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-[#faf8f4]">
                    Astrologer Announcements, Promo Ads & Notices
                  </h3>
                  <p className="text-xs text-gray-400">
                    Post promotional bonus banners, commission alerts, Mahashivratri offers, or urgent operating guidelines directly to empaneled Astrologer Portal dashboards.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddAnnouncementModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Post Announcement / Ad</span>
                </button>
              </div>

              {/* ANNOUNCEMENTS LIST TABLE */}
              <div className="bg-[#1c2541] rounded-3xl border border-[#3a506b] overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#3a506b] flex justify-between items-center">
                  <h4 className="font-serif font-bold text-xl text-[#fbbf24]">
                    Active Announcements & Notice Board Items ({announcements.length})
                  </h4>
                  <span className="text-xs text-gray-400">Displayed live on `/dashboard/astrologer`</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0b132b] border-b border-[#3a506b] text-[#fbbf24] font-serif uppercase">
                        <th className="p-4">Type & Badge</th>
                        <th className="p-4">Announcement Title & Message</th>
                        <th className="p-4">CTA Button</th>
                        <th className="p-4">Target Audience</th>
                        <th className="p-4">Posted Date</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3a506b]/50">
                      {announcements.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
                            No active announcements posted. Click "+ Post Announcement / Ad" above to create one.
                          </td>
                        </tr>
                      ) : (
                        announcements.map((ann) => (
                          <tr key={ann.id} className="hover:bg-[#0b132b]/40">
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase border border-amber-500/30">
                                {ann.badge || ann.type}
                              </span>
                            </td>
                            <td className="p-4 max-w-md">
                              <div className="font-bold text-white text-sm mb-0.5">{ann.title}</div>
                              <p className="text-gray-300 text-xs line-clamp-2">{ann.message}</p>
                            </td>
                            <td className="p-4">
                              {ann.actionText ? (
                                <span className="px-3 py-1 rounded-lg bg-[#0b132b] border border-[#3a506b] text-[#fbbf24] text-[10px] font-bold font-mono">
                                  {ann.actionText} →
                                </span>
                              ) : (
                                <span className="text-gray-500 text-[10px] font-mono">None</span>
                              )}
                            </td>
                            <td className="p-4 font-mono text-gray-300">{ann.targetAudience || 'ALL_ASTROLOGERS'}</td>
                            <td className="p-4 font-mono text-gray-400">{ann.createdAt}</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleDeleteAnnouncement(ann.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white font-bold text-xs cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4C: ASSIGN DELIVERY & COURIER LOGISTICS HUB */}
          {activeTab === 'shop_delivery' && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-extrabold uppercase mb-2 border border-sky-500/30">
                    <Truck className="w-3.5 h-3.5 text-sky-300" />
                    Delivery Assignment & Shipping Logistics
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-[#faf8f4]">
                    Assign Delivery Partners & Issuing Tracking AWBs
                  </h3>
                  <p className="text-xs text-gray-400">
                    Assign courier partners (*BlueDart*, *DTDC*, *India Post*, *Local Runner*), enter tracking numbers, and send automated WhatsApp dispatch alerts to buyers.
                  </p>
                </div>
              </div>

              {/* Delivery Queue Cards */}
              <div className="space-y-4">
                {shopOrders.map((ord) => (
                  <div key={ord.id} className="p-6 rounded-3xl bg-[#1c2541] border border-[#3a506b] space-y-4 shadow-lg font-sans">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#3a506b]/60">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-extrabold text-[#fbbf24] text-base">{ord.orderRef}</span>
                        <span className={`px-3 py-0.5 rounded-full text-xs font-extrabold ${
                          ord.status === 'DISPATCHED' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <span className="text-xs text-gray-400">Ordered At: <strong className="text-white">{ord.orderedAt}</strong></span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Buyer Details */}
                      <div className="p-4 rounded-2xl bg-[#0b132b] border border-[#3a506b]/50 space-y-1">
                        <span className="text-[10px] font-bold text-[#e0a96d] uppercase block">Buyer & Shipping Contact</span>
                        <div className="font-bold text-white text-sm">{ord.buyerName}</div>
                        <div className="text-amber-300 font-mono">{ord.whatsappNo || ord.mobile}</div>
                        <div className="text-gray-300 text-[11px] pt-1">{ord.address} (PIN: {ord.pincode})</div>
                      </div>

                      {/* Items Ordered */}
                      <div className="p-4 rounded-2xl bg-[#0b132b] border border-[#3a506b]/50 space-y-1">
                        <span className="text-[10px] font-bold text-[#e0a96d] uppercase block">Order Contents</span>
                        {ord.items.map((it, iIdx) => (
                          <div key={iIdx} className="font-bold text-white text-xs">
                            • {it.title} <span className="text-[#fbbf24]">x{it.quantity}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-[#3a506b]/40 font-mono text-emerald-400 font-extrabold text-sm">
                          Paid Total: ₹{ord.totalAmount.toLocaleString()} (UTR: {ord.utr})
                        </div>
                      </div>

                      {/* Courier & Tracking Assignment */}
                      <div className="p-4 rounded-2xl bg-[#0b132b] border border-[#3a506b]/50 space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#e0a96d] uppercase block mb-1">Assigned Delivery Details</span>
                          {ord.courierPartner ? (
                            <div className="space-y-1 font-mono text-xs">
                              <div className="text-sky-300 font-bold">🚚 {ord.courierPartner}</div>
                              <div className="text-amber-300">AWB: {ord.trackingNumber}</div>
                              <div className="text-gray-400 text-[11px]">Est. Delivery: {ord.expectedDeliveryDate}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">No delivery partner assigned yet.</span>
                          )}
                        </div>

                        <div className="pt-2 flex flex-col gap-2">
                          <button
                            onClick={() => {
                              setAssignDeliveryModalOrder(ord);
                              setDeliveryForm({
                                courierPartner: ord.courierPartner || 'BlueDart Express',
                                trackingNumber: ord.trackingNumber || 'BD-' + Math.floor(10000000 + Math.random() * 90000000) + 'IN',
                                deliveryAgentPhone: ord.deliveryAgentPhone || '+91 98620 11223',
                                expectedDeliveryDate: ord.expectedDeliveryDate || '2026-08-30',
                              });
                            }}
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-md hover:opacity-95 cursor-pointer"
                          >
                            <Truck className="w-4 h-4" />
                            <span>{ord.courierPartner ? 'Edit Delivery Info' : 'Assign Courier & Issue AWB'}</span>
                          </button>

                          {ord.trackingNumber && (
                            <a
                              href={`https://wa.me/${(ord.whatsappNo || ord.mobile).replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(ord.buyerName)},%20your%20KangleiAstro%20Store%20Order%20${ord.orderRef}%20has%20been%20dispatched%20via%20${encodeURIComponent(ord.courierPartner || 'Courier')}!%20Tracking%20AWB:%20${encodeURIComponent(ord.trackingNumber)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Dispatch WhatsApp Tracking</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GLOBAL ASSIGN DELIVERY MODAL */}
          {assignDeliveryModalOrder && (
            <div className="fixed inset-0 z-50 bg-[#0b132b]/80 backdrop-blur-xs flex items-center justify-center p-4">
              <form onSubmit={handleAssignDelivery} className="bg-[#1c2541] w-full max-w-md rounded-3xl border border-[#3a506b] p-6 space-y-4 text-xs font-sans text-white shadow-2xl">
                <div className="flex justify-between items-center pb-3 border-b border-[#3a506b]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#fbbf24]" />
                    <h4 className="font-serif font-bold text-lg text-white">Assign Delivery Logistics</h4>
                  </div>
                  <button type="button" onClick={() => setAssignDeliveryModalOrder(null)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-[#0b132b] border border-[#3a506b]/50">
                  <span className="text-[10px] font-bold text-[#e0a96d] uppercase block">Order Reference</span>
                  <div className="font-mono font-extrabold text-[#fbbf24] text-sm">{assignDeliveryModalOrder.orderRef}</div>
                  <div className="text-gray-300 text-xs">{assignDeliveryModalOrder.buyerName} ({assignDeliveryModalOrder.address})</div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                    Select Courier / Delivery Partner *
                  </label>
                  <select
                    value={deliveryForm.courierPartner}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, courierPartner: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs"
                  >
                    <option value="BlueDart Express">BlueDart Express</option>
                    <option value="DTDC Express">DTDC Express</option>
                    <option value="India Post Speed Post">India Post Speed Post</option>
                    <option value="Delhivery Express">Delhivery Express</option>
                    <option value="Local Imphal Delivery Runner">Local Imphal Delivery Runner</option>
                    <option value="Custom Courier Service">Custom Courier Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                    Tracking Airway Bill (AWB) / Ref No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BD-98401928IN"
                    value={deliveryForm.trackingNumber}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, trackingNumber: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-[#fbbf24] font-mono font-bold text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Delivery Agent Phone
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98620 11223"
                      value={deliveryForm.deliveryAgentPhone}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryAgentPhone: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Expected Delivery Date
                    </label>
                    <input
                      type="date"
                      value={deliveryForm.expectedDeliveryDate}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, expectedDeliveryDate: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setAssignDeliveryModalOrder(null)}
                    className="px-4 py-2 rounded-xl bg-[#0b132b] text-gray-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md"
                  >
                    Save & Mark Dispatched →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CATEGORY MANAGER MODAL */}
          {showCategoryManagerModal && (
            <div className="fixed inset-0 z-50 bg-[#0b132b]/80 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-[#1c2541] w-full max-w-lg rounded-3xl border border-[#3a506b] p-6 space-y-5 text-xs font-sans text-white shadow-2xl">
                <div className="flex justify-between items-center pb-3 border-b border-[#3a506b]">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#fbbf24]" />
                    <h4 className="font-serif font-bold text-xl text-white">E-Store Dynamic Categories Manager</h4>
                  </div>
                  <button type="button" onClick={() => setShowCategoryManagerModal(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Create New Category Form */}
                <form onSubmit={handleAddCategory} className="p-4 rounded-2xl bg-[#0b132b] border border-[#3a506b] space-y-3">
                  <span className="text-[10px] font-bold text-[#e0a96d] uppercase block">Add New Product Category</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Meitei Cultural Artifacts, Feng Shui..."
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#1c2541] text-white font-bold text-xs"
                    />
                    <button
                      type="submit"
                      className="px-5 h-10 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md shrink-0 hover:opacity-95"
                    >
                      + Add Category
                    </button>
                  </div>
                </form>

                {/* Active Categories List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[#e0a96d] uppercase block">Active E-Store Categories ({shopCategories.length})</span>
                  <div className="divide-y divide-[#3a506b]/40 rounded-2xl bg-[#0b132b] border border-[#3a506b]/60 overflow-hidden max-h-60 overflow-y-auto">
                    {shopCategories.map((cat, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between hover:bg-[#1c2541]/40">
                        <div className="flex items-center gap-2 font-bold text-white text-xs">
                          <Tag className="w-3.5 h-3.5 text-[#fbbf24]" />
                          <span>{cat}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          className="px-2.5 py-1 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white font-bold text-[10px] transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-[#3a506b]">
                  <button
                    type="button"
                    onClick={() => setShowCategoryManagerModal(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#0b132b] text-gray-300 font-bold text-xs border border-[#3a506b]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5A: EMPANELED ASTROLOGER ACCOUNTS & PROFILES */}
          {activeTab === 'astrologers' && (
            <div className="bg-white rounded-2xl border border-[#f3e8d2] shadow-xl p-6 space-y-6 text-[#0f172a]">
              <div className="flex flex-wrap justify-between items-center pb-4 border-b border-[#fde68a] gap-4">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Empaneled Astrologer Accounts & Profiles</h3>
                  <p className="text-xs text-gray-500 font-sans font-medium">Manage registered Astrologers, edit profiles, hold/suspend access, or delete accounts</p>
                </div>
                <button
                  onClick={() => {
                    setEditingAstroId(null);
                    setNewAstroForm(DEFAULT_ASTRO_FORM);
                    setActiveTab('add_astro');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs hover:opacity-95 transition-opacity flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Register New Astrologer</span>
                </button>
              </div>

              {/* ASTROLOGER ACCOUNTS MANAGEMENT TABLE */}
              <div className={`rounded-3xl border overflow-hidden shadow-2xl transition-colors ${
                theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-300 shadow-lg'
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="bg-[#0f172a] text-[#fbbf24] font-serif font-extrabold uppercase tracking-wider text-xs border-b border-[#3a506b]">
                        <th className="p-4">Astrologer Guru & Handle</th>
                        <th className="p-4">Specialty & Location</th>
                        <th className="p-4">Phone & WhatsApp</th>
                        <th className="p-4 text-center">Exp (Yrs)</th>
                        <th className="p-4 text-center">Account Status</th>
                        <th className="p-4 text-right">Admin Account Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${
                      theme === 'dark' ? 'divide-[#3a506b]/50 text-white' : 'divide-slate-200 text-slate-900'
                    }`}>
                      {astrologers.map((astro) => {
                        const isOnHold = astro.status === 'ON_HOLD';

                        return (
                          <tr key={astro.id} className={`transition-colors ${
                            isOnHold 
                              ? (theme === 'dark' ? 'bg-amber-950/50 border-l-4 border-l-amber-500' : 'bg-amber-100/80 border-l-4 border-l-amber-600')
                              : (theme === 'dark' ? 'hover:bg-[#1c2541] odd:bg-[#0b132b] even:bg-[#0f172a]/60' : 'hover:bg-amber-50/80 odd:bg-white even:bg-slate-50')
                          }`}>
                            {/* 1. Guru Name & Handle */}
                            <td className="p-4 cursor-pointer" onClick={() => {
                              setSelectedAstrologer(astro);
                              setActiveTab('astro_profile');
                            }}>
                              <div className="flex items-center gap-3">
                                <img
                                  src={astro.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80'}
                                  alt={astro.name}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shrink-0 shadow-sm"
                                />
                                <div>
                                  <div className={`font-serif font-extrabold text-base hover:text-[#d97706] transition-colors ${
                                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                                  }`}>
                                    {astro.name}
                                  </div>
                                  <div className="inline-block mt-0.5">
                                    <span className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-md shadow-xs border ${
                                      theme === 'dark' ? 'text-sky-300 bg-sky-950 border-sky-400/60' : 'text-sky-900 bg-sky-100 border-sky-400'
                                    }`}>
                                      @{astro.username || astro.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* 2. Specialty & Manipur Location */}
                            <td className="p-4">
                              <span className={`text-xs font-extrabold block ${
                                theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-800'
                              }`}>
                                {astro.specialty}
                              </span>
                              <div className={`text-xs font-bold mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-md border shadow-xs ${
                                theme === 'dark' ? 'text-white bg-slate-800 border-slate-600' : 'text-slate-900 bg-slate-200 border-slate-400'
                              }`}>
                                📍 {astro.address || 'Imphal West, Manipur'}
                              </div>
                            </td>

                            {/* 3. Phone & WhatsApp */}
                            <td className="p-4">
                              <a
                                href={`https://wa.me/${astro.whatsappNo.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-xs px-3 py-1 rounded-lg font-mono font-extrabold hover:underline inline-flex items-center gap-1.5 shadow-sm transition-all border ${
                                  theme === 'dark' ? 'text-emerald-300 bg-emerald-950 hover:bg-emerald-900 border-emerald-400' : 'text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border-emerald-500'
                                }`}
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{astro.whatsappNo}</span>
                              </a>
                              <span className={`text-xs font-mono font-bold block mt-1 ${
                                theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                              }`}>📞 {astro.phone}</span>
                            </td>

                            {/* 4. Experience Years */}
                            <td className="p-4 text-center font-mono font-bold">
                              <span className={`px-3 py-1.5 rounded-full font-extrabold text-xs shadow-sm border ${
                                theme === 'dark' ? 'bg-amber-500/25 text-amber-200 border-amber-400' : 'bg-amber-100 text-amber-900 border-amber-400'
                              }`}>
                                {astro.experienceYears || 15} Yrs Exp
                              </span>
                            </td>

                            {/* 5. Account Status Pill */}
                            <td className="p-4 text-center">
                              {isOnHold ? (
                                <span className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-sm border inline-flex items-center gap-1 ${
                                  theme === 'dark' ? 'bg-amber-500/30 text-amber-200 border-amber-400' : 'bg-amber-100 text-amber-900 border-amber-500'
                                }`}>
                                  🟡 ON HOLD (Suspended)
                                </span>
                              ) : (
                                <span className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-sm border inline-flex items-center gap-1 ${
                                  theme === 'dark' ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400' : 'bg-emerald-100 text-emerald-900 border-emerald-500'
                                }`}>
                                  🟢 ACTIVE & ONLINE
                                </span>
                              )}
                            </td>

                            {/* 6. Admin Account Actions */}
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedAstrologer(astro);
                                    setActiveTab('astro_profile');
                                  }}
                                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                                  title="View Full Profile Dossier"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Profile</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setEditingAstroId(astro.id);
                                    setNewAstroForm({
                                      ...DEFAULT_ASTRO_FORM,
                                      avatar: astro.avatar || DEFAULT_ASTRO_FORM.avatar,
                                      name: astro.name || '',
                                      specialty: astro.specialty || '',
                                      phone: astro.phone || astro.whatsappNo || '',
                                      whatsappNo: astro.whatsappNo || '',
                                      sameAsWhatsapp: astro.sameAsWhatsapp ?? true,
                                      email: astro.email || '',
                                      streetLane: astro.streetLane || '',
                                      cityDistrict: astro.cityDistrict || 'Imphal West',
                                      state: astro.state || 'Manipur',
                                      pincode: astro.pincode || '795001',
                                      experienceYears: astro.experienceYears || 10,
                                      languages: astro.languages || ['Manipuri (Meiteilon)', 'English'],
                                      username: astro.username || '',
                                      password: astro.password || 'guru123',
                                      address: astro.address || 'Imphal West, Manipur',
                                      upiId: astro.upiId || '',
                                      bankName: astro.bankName || 'State Bank of India (SBI)',
                                      accountHolder: astro.accountHolder || astro.name,
                                      accountNo: astro.accountNo || '',
                                      ifscCode: astro.ifscCode || 'SBIN0001234',
                                      payoutMethod: astro.payoutMethod || 'UPI',
                                      planTier: astro.planTier || 'ADVANCE',
                                      allowedTools: astro.allowedTools || DEFAULT_ASTRO_FORM.allowedTools,
                                      status: astro.status || 'ACTIVE',
                                    });
                                    setActiveTab('add_astro');
                                  }}
                                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                                  title="Edit Full Name, Username, Phone, Manipur Address, & Password"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  onClick={() => handleToggleHoldAstrologer(astro.id, astro.status)}
                                  className={`px-3.5 py-2 rounded-xl font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
                                    isOnHold
                                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                                  }`}
                                  title={isOnHold ? 'Re-activate Astrologer Account' : 'Put Astrologer Profile on Hold'}
                                >
                                  {isOnHold ? '🟢 Activate' : '🟡 Hold'}
                                </button>

                                <button
                                  onClick={() => handleDeleteAstrologerAccount(astro.id, astro.name)}
                                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                                  title="Permanently Delete Astrologer Account"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5B: REGISTER / EDIT EMPANELED ASTROLOGER ACCOUNT & PASSWORD */}
          {activeTab === 'add_astro' && (
            <div className="bg-white rounded-3xl border border-[#f3e8d2] shadow-xl p-6 sm:p-8 space-y-6 text-[#0f172a]">
              <div className="flex flex-wrap justify-between items-center pb-4 border-b border-[#fde68a] gap-4">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a]">
                    {editingAstroId ? 'Edit Empaneled Jyotish Guru Account' : 'Register New Empaneled Jyotish Guru'}
                  </h3>
                  <p className="text-xs text-gray-500 font-sans font-medium">
                    Create login credentials, assign specialty, phone number, Manipur address & portal password
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('astrologers')}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer border border-gray-300"
                >
                  ← Back to All Jyotishs
                </button>
              </div>

              <form onSubmit={(e) => {
                handleRegisterNewAstro(e);
                setActiveTab('astrologers');
              }} className="p-6 sm:p-8 rounded-3xl bg-[#fefcf6] border border-[#fde68a] space-y-7 font-sans text-xs text-[#0f172a] shadow-sm">
                
                {/* SECTION 1: PERSONAL & CONTACT INFORMATION */}
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-lg text-[#b45309] border-b border-[#fde68a] pb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#d97706]" />
                    <span>1. Personal Particulars & Contact Information</span>
                  </h4>

                  {/* PROFILE PHOTO / AVATAR UPLOADER */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white border border-[#fde68a] shadow-xs">
                    <div className="relative shrink-0">
                      <img
                        src={newAstroForm.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80'}
                        alt="Guru Profile Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#d97706] shadow-md bg-amber-50"
                      />
                      <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" title="Active Status Preview" />
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div>
                        <h5 className="font-bold text-[#0f172a] text-xs">Jyotish Guru Profile Photo / Avatar</h5>
                        <p className="text-[11px] text-gray-500">Upload a portrait photo or paste an image URL to display on the portal & website listing</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                        <label className="px-3.5 py-1.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-xs transition-colors">
                          <Camera className="w-3.5 h-3.5" />
                          <span>Upload Photo...</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setNewAstroForm({ ...newAstroForm, avatar: reader.result });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        <div className="flex-1 min-w-[200px]">
                          <input
                            type="url"
                            placeholder="Or paste image URL (https://...)"
                            value={newAstroForm.avatar || ''}
                            onChange={(e) => setNewAstroForm({ ...newAstroForm, avatar: e.target.value })}
                            className="w-full h-8 px-3 rounded-lg border border-gray-300 text-[11px] font-mono focus:border-[#d97706] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acharya Tombi Sharma"
                        value={newAstroForm.name}
                        onChange={(e) => setNewAstroForm({ ...newAstroForm, name: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-1">
                        Assign Portal Username *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3 font-mono font-bold text-gray-400">@</span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. tombi_guru"
                          value={newAstroForm.username}
                          onChange={(e) => setNewAstroForm({ ...newAstroForm, username: e.target.value })}
                          className="w-full h-11 pl-8 pr-3.5 rounded-xl border border-gray-300 bg-[#eff6ff] text-[#b45309] font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-1">
                        Contact Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98620 12345"
                        value={newAstroForm.phone}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewAstroForm({
                            ...newAstroForm,
                            phone: val,
                            whatsappNo: newAstroForm.sameAsWhatsapp ? val : newAstroForm.whatsappNo
                          });
                        }}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-[#b45309] font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider">
                          WhatsApp Mobile Number *
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <input
                            type="checkbox"
                            checked={newAstroForm.sameAsWhatsapp}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setNewAstroForm({
                                ...newAstroForm,
                                sameAsWhatsapp: checked,
                                whatsappNo: checked ? newAstroForm.phone : newAstroForm.whatsappNo
                              });
                            }}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>Same as Mobile</span>
                        </label>
                      </div>
                      <input
                        type="tel"
                        required
                        disabled={newAstroForm.sameAsWhatsapp}
                        placeholder="+91 98620 12345"
                        value={newAstroForm.sameAsWhatsapp ? newAstroForm.phone : newAstroForm.whatsappNo}
                        onChange={(e) => setNewAstroForm({ ...newAstroForm, whatsappNo: e.target.value })}
                        className={`w-full h-11 px-3.5 rounded-xl border border-gray-300 font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none ${
                          newAstroForm.sameAsWhatsapp ? 'bg-gray-100 text-gray-600' : 'bg-white text-emerald-700'
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-1">
                        Official Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. guru.tombi@kangleiastro.com"
                        value={newAstroForm.email}
                        onChange={(e) => setNewAstroForm({ ...newAstroForm, email: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-[#0f172a] font-mono text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: SPECIALTY & QUALIFICATIONS */}
                <div className="space-y-4 pt-2 border-t border-[#fde68a]">
                  <h4 className="font-serif font-bold text-lg text-[#b45309] border-b border-[#fde68a] pb-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#d97706]" />
                    <span>2. Astrological Specialty & Qualifications</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-1">
                        Primary Specialty Focus *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kuthi Yengba, Dasha & Vedic Remedies"
                        value={newAstroForm.specialty}
                        onChange={(e) => setNewAstroForm({ ...newAstroForm, specialty: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none mb-2"
                      />
                      
                      {/* Clickable Quick Specialty Tag Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-gray-500 font-bold">Quick Presets:</span>
                        {['Kuthi Yengba', 'Kuthi Iba', 'Numit Leppa', 'Navamsha D9', 'Gemstone Remedy', 'Gun Milan'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              const current = newAstroForm.specialty;
                              const updated = current ? `${current}, ${preset}` : preset;
                              setNewAstroForm({ ...newAstroForm, specialty: updated });
                            }}
                            className="px-2.5 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] border border-amber-300 transition-colors cursor-pointer"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-1">
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        placeholder="15"
                        value={newAstroForm.experienceYears}
                        onChange={(e) => setNewAstroForm({ ...newAstroForm, experienceYears: Number(e.target.value) })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-[#b45309] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: FULL RESIDENTIAL & MANIPUR LOCATION ADDRESS */}
                <div className="space-y-4 pt-2 border-t border-[#fde68a]">
                  <h4 className="font-serif font-bold text-lg text-[#b45309] border-b border-[#fde68a] pb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#d97706]" />
                    <span>3. Residential Address & Location Details</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-1">
                        Street / Lane / Leikai Address *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Uripok Bachaspati Leikai"
                        value={newAstroForm.streetLane}
                        onChange={(e) => setNewAstroForm({ ...newAstroForm, streetLane: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-[#0f172a] font-medium text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-1">
                        City / District / Location *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Imphal West"
                        value={newAstroForm.cityDistrict}
                        onChange={(e) => setNewAstroForm({ ...newAstroForm, cityDistrict: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-1">
                        Pincode / Zip Code
                      </label>
                      <input
                        type="text"
                        placeholder="795001"
                        value={newAstroForm.pincode}
                        onChange={(e) => setNewAstroForm({ ...newAstroForm, pincode: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-[#0f172a] font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: FINANCIAL PAYOUT & BANK / UPI DETAILS */}
                <div className="space-y-4 pt-2 border-t border-[#fde68a]">
                  <div className="flex flex-wrap items-center justify-between border-b border-[#fde68a] pb-2 gap-2">
                    <h4 className="font-serif font-bold text-lg text-[#b45309] flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span>4. Financial Payout & Bank Settlement Details</span>
                    </h4>
                    
                    <div className="flex items-center gap-4 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-800 cursor-pointer">
                        <input
                          type="radio"
                          name="payoutMethod"
                          value="UPI"
                          checked={newAstroForm.payoutMethod === 'UPI'}
                          onChange={() => setNewAstroForm({ ...newAstroForm, payoutMethod: 'UPI' })}
                          className="text-[#d97706] focus:ring-[#d97706]"
                        />
                        <span>UPI VPA ID</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-800 cursor-pointer">
                        <input
                          type="radio"
                          name="payoutMethod"
                          value="BANK"
                          checked={newAstroForm.payoutMethod === 'BANK'}
                          onChange={() => setNewAstroForm({ ...newAstroForm, payoutMethod: 'BANK' })}
                          className="text-[#d97706] focus:ring-[#d97706]"
                        />
                        <span>Direct Bank Transfer</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-green-800 uppercase tracking-wider mb-1">
                        Merchant / Payee UPI VPA ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. tombi@ybl or 9862012345@upi"
                        value={newAstroForm.upiId}
                        onChange={(e) => setNewAstroForm({ ...newAstroForm, upiId: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#f0fdf4] text-green-800 font-mono font-bold text-xs focus:border-green-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. State Bank of India (SBI)"
                        value={newAstroForm.bankName}
                        onChange={(e) => setNewAstroForm({ ...newAstroForm, bankName: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 30847291823"
                        value={newAstroForm.accountNo}
                        onChange={(e) => setNewAstroForm({ ...newAstroForm, accountNo: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-[#0f172a] font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-1">
                        Bank IFSC Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SBIN0001234"
                        value={newAstroForm.ifscCode}
                        onChange={(e) => setNewAstroForm({ ...newAstroForm, ifscCode: e.target.value.toUpperCase() })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-blue-700 font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 5: EMPANELMENT PLAN TIER & TOOL ACCESS PERMISSIONS */}
                <div className="space-y-4 pt-2 border-t border-[#fde68a]">
                  <h4 className="font-serif font-bold text-lg text-[#b45309] border-b border-[#fde68a] pb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#d97706]" />
                    <span>5. Empanelment Plan Tier & Tool Access Permissions</span>
                  </h4>

                  {/* Plan Tier Selection Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'BASIC', title: 'Basic Guru', split: '70% Payout Share', badge: 'Standard Access', color: 'border-slate-300 bg-slate-50' },
                      { id: 'ADVANCE', title: 'Advance Guru', split: '80% Payout Share', badge: 'Priority Orders', color: 'border-amber-400 bg-amber-50/60' },
                      { id: 'PRO', title: 'Pro Master Guru', split: '90% Payout Share', badge: 'Featured Badge', color: 'border-purple-400 bg-purple-50/60' }
                    ].map((tier) => (
                      <label
                        key={tier.id}
                        onClick={() => setNewAstroForm({ ...newAstroForm, planTier: tier.id as any })}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                          newAstroForm.planTier === tier.id ? 'border-[#d97706] bg-amber-100/70 shadow-sm' : tier.color
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="planTier"
                              value={tier.id}
                              checked={newAstroForm.planTier === tier.id}
                              onChange={() => setNewAstroForm({ ...newAstroForm, planTier: tier.id as any })}
                              className="text-[#d97706] focus:ring-[#d97706]"
                            />
                            <span className="font-serif font-bold text-sm text-[#0f172a]">{tier.title}</span>
                          </div>
                          <span className="text-[11px] font-extrabold text-[#b45309] block ml-5">{tier.split}</span>
                        </div>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white border border-[#fde68a] text-amber-900">
                          {tier.badge}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Accessible Tools & Calculators Checkboxes */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider">
                      Select Accessible Astrology Calculators & Service Tools:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 bg-white p-4 rounded-2xl border border-gray-200">
                      {[
                        { id: 'kuthi-generator', label: 'Kuthi Generator (Natal D1/D9)' },
                        { id: 'dasha-yengpham', label: 'Dasha Yengpham (Vimshottari)' },
                        { id: 'shani-sade-sati', label: 'Shani Sade Sati & Dhaiya' },
                        { id: 'kaal-sarp-dosh', label: 'Kaal Sarp Dosh Analysis' },
                        { id: 'astrology-yoga', label: 'Planetary Yogas Evaluator' },
                        { id: 'match-making', label: 'Match Making (36-Gun Milan)' },
                        { id: 'kuthi-iba', label: 'Kuthi Iba (Handwritten Scroll)' },
                        { id: 'numit-leppa', label: 'Numit Leppa (Auspicious Muhurat)' },
                        { id: 'estore-vendor', label: 'E-Store Vendor Catalog Access' },
                      ].map((tool) => {
                        const isChecked = (newAstroForm.allowedTools || []).includes(tool.id);
                        return (
                          <label
                            key={tool.id}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                              isChecked ? 'bg-amber-50 border-[#d97706]/50 text-[#b45309]' : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const current = newAstroForm.allowedTools || [];
                                const updated = checked
                                  ? [...current, tool.id]
                                  : current.filter((t) => t !== tool.id);
                                setNewAstroForm({ ...newAstroForm, allowedTools: updated });
                              }}
                              className="rounded text-[#d97706] focus:ring-[#d97706]"
                            />
                            <span>{tool.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* SECTION 6: PORTAL ACCESS & ACCOUNT STATUS */}
                <div className="space-y-4 pt-2 border-t border-[#fde68a]">
                  <h4 className="font-serif font-bold text-lg text-[#b45309] border-b border-[#fde68a] pb-2 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#d97706]" />
                    <span>6. Portal Login Security & Account Status</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-1">
                        Assign Portal Login Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={newAstroForm.password}
                          onChange={(e) => setNewAstroForm({ ...newAstroForm, password: e.target.value })}
                          className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-gray-300 bg-[#eff6ff] text-[#0f172a] font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-500 hover:text-gray-800 text-[10px] font-bold uppercase"
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-1">
                        Account Activation Status
                      </label>
                      <div className="flex items-center gap-4 h-11 bg-white px-4 rounded-xl border border-gray-300">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value="ACTIVE"
                            checked={newAstroForm.status === 'ACTIVE'}
                            onChange={() => setNewAstroForm({ ...newAstroForm, status: 'ACTIVE' })}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>🟢 ACTIVE & ONLINE</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-amber-800 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value="ON_HOLD"
                            checked={newAstroForm.status === 'ON_HOLD'}
                            onChange={() => setNewAstroForm({ ...newAstroForm, status: 'ON_HOLD' })}
                            className="text-amber-600 focus:ring-amber-500"
                          />
                          <span>🟡 ON HOLD (Suspended)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#fde68a]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('astrologers')}
                    className="px-6 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 cursor-pointer"
                  >
                    {editingAstroId ? 'Update & Save Astrologer Account →' : 'Save Astrologer Account →'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5C: JYOTISH GURU FULL PROFILE DOSSIER & PASSWORD UPDATE */}
          {activeTab === 'astro_profile' && selectedAstrologer && (
            <div className="space-y-6 text-[#0f172a] font-sans">
              {/* TOP NAVIGATION & HEADER */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#f3e8d2] shadow-xl">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('astrologers')}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer border border-gray-300 transition-colors"
                  >
                    ← Back to All Jyotishs
                  </button>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Jyotish Guru Profile Dossier</h3>
                    <p className="text-xs text-gray-500 font-medium">Complete registered credentials, contact information, plan tier & tools permissions</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAstroId(selectedAstrologer.id);
                      setNewAstroForm({
                        ...DEFAULT_ASTRO_FORM,
                        avatar: selectedAstrologer.avatar || DEFAULT_ASTRO_FORM.avatar,
                        name: selectedAstrologer.name || '',
                        specialty: selectedAstrologer.specialty || '',
                        phone: selectedAstrologer.phone || selectedAstrologer.whatsappNo || '',
                        whatsappNo: selectedAstrologer.whatsappNo || '',
                        sameAsWhatsapp: selectedAstrologer.sameAsWhatsapp ?? true,
                        email: selectedAstrologer.email || '',
                        streetLane: selectedAstrologer.streetLane || '',
                        cityDistrict: selectedAstrologer.cityDistrict || 'Imphal West',
                        state: selectedAstrologer.state || 'Manipur',
                        pincode: selectedAstrologer.pincode || '795001',
                        experienceYears: selectedAstrologer.experienceYears || 10,
                        languages: selectedAstrologer.languages || ['Manipuri (Meiteilon)', 'English'],
                        username: selectedAstrologer.username || '',
                        password: selectedAstrologer.password || 'guru123',
                        address: selectedAstrologer.address || 'Imphal West, Manipur',
                        upiId: selectedAstrologer.upiId || '',
                        bankName: selectedAstrologer.bankName || 'State Bank of India (SBI)',
                        accountHolder: selectedAstrologer.accountHolder || selectedAstrologer.name,
                        accountNo: selectedAstrologer.accountNo || '',
                        ifscCode: selectedAstrologer.ifscCode || 'SBIN0001234',
                        payoutMethod: selectedAstrologer.payoutMethod || 'UPI',
                        planTier: selectedAstrologer.planTier || 'ADVANCE',
                        allowedTools: selectedAstrologer.allowedTools || DEFAULT_ASTRO_FORM.allowedTools,
                        status: selectedAstrologer.status || 'ACTIVE',
                      });
                      setActiveTab('add_astro');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Full Profile</span>
                  </button>
                </div>
              </div>

              {/* MAIN PROFILE DOSSIER CARD */}
              <div className="bg-white rounded-3xl border border-[#fde68a] shadow-2xl overflow-hidden">
                {/* BANNER HEADER */}
                <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0b132b] p-6 sm:p-8 text-white relative">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* PROFILE PHOTO AVATAR */}
                    <div className="relative shrink-0">
                      <img
                        src={selectedAstrologer.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80'}
                        alt={selectedAstrologer.name}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#d97706] shadow-2xl bg-amber-50"
                      />
                      <span
                        className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-[#0f172a] ${
                          selectedAstrologer.status === 'ON_HOLD' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        title={selectedAstrologer.status === 'ON_HOLD' ? 'Account On Hold' : 'Active & Online'}
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">{selectedAstrologer.name}</h2>
                        <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-[#fbbf24] text-xs font-mono font-extrabold border border-amber-400/40">
                          @{selectedAstrologer.username || selectedAstrologer.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}
                        </span>
                      </div>

                      <p className="text-amber-300 text-sm font-semibold">{selectedAstrologer.specialty || 'Kuthi Yengba & Vedic Astrology'}</p>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-medium">
                        <span className="px-3 py-1 rounded-xl bg-white/10 text-gray-200 border border-white/15">
                          📍 {selectedAstrologer.address || 'Imphal West, Manipur'}
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-white/10 text-amber-300 border border-white/15">
                          ⭐ {selectedAstrologer.experienceYears || 15} Years Experience
                        </span>
                        <span className={`px-3 py-1 rounded-xl font-bold border ${
                          selectedAstrologer.status === 'ON_HOLD' ? 'bg-amber-500/30 text-amber-200 border-amber-400' : 'bg-emerald-500/30 text-emerald-200 border-emerald-400'
                        }`}>
                          {selectedAstrologer.status === 'ON_HOLD' ? '🟡 ON HOLD' : '🟢 ACTIVE & ONLINE'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DETAILED INFORMATION GRID */}
                <div className="p-6 sm:p-8 space-y-8 bg-[#fefcf6]">
                  {/* ROW 1: CONTACT & LOCATION DOSSIER */}
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-base text-[#b45309] border-b border-[#fde68a] pb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#d97706]" />
                      <span>Contact & Manipur Location Particulars</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Mobile Phone Number</span>
                        <span className="font-mono font-bold text-gray-900 block text-sm">📞 {selectedAstrologer.phone || selectedAstrologer.whatsappNo}</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">WhatsApp Direct Contact</span>
                        <a
                          href={`https://wa.me/${(selectedAstrologer.whatsappNo || '').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono font-bold text-emerald-700 hover:underline block text-sm inline-flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{selectedAstrologer.whatsappNo}</span>
                        </a>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Official Email Address</span>
                        <span className="font-mono font-bold text-gray-800 block truncate">✉️ {selectedAstrologer.email || 'ccare@kangleiastro.com'}</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Full Manipur Address</span>
                        <span className="font-semibold text-gray-900 block">📍 {selectedAstrologer.address || 'Imphal West, Manipur'}</span>
                      </div>
                    </div>
                  </div>

                  {/* ROW 2: LOGIN CREDENTIALS & PASSWORD UPDATE BOX */}
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-base text-[#b45309] border-b border-[#fde68a] pb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#d97706]" />
                      <span>Portal Login Credentials & Security Settings</span>
                    </h4>

                    <div className="p-4 sm:p-5 rounded-2xl bg-[#eff6ff] border border-blue-200 flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">Portal Username & Password</span>
                        <div className="flex items-center gap-4 text-xs font-mono font-bold text-slate-900">
                          <span>Username: <strong className="text-blue-800">@{selectedAstrologer.username || selectedAstrologer.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}</strong></span>
                          <span>•</span>
                          <span>Password: <strong className="bg-white px-2.5 py-1 rounded border border-blue-300 text-blue-900 font-mono text-sm">{selectedAstrologer.password || '••••••••'}</strong></span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setNewPasswordInput(selectedAstrologer.password || '');
                          setShowPasswordUpdateModal(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm cursor-pointer flex items-center gap-1.5 transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>🔑 Update Password</span>
                      </button>
                    </div>
                  </div>

                  {/* ROW 3: FINANCIAL PAYOUT & BANK ACCOUNT DETAILS */}
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-base text-[#b45309] border-b border-[#fde68a] pb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span>Financial Payout & Bank Settlement Details</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Payout Preference</span>
                        <span className="font-bold text-emerald-900 block text-sm">💳 {selectedAstrologer.payoutMethod || 'UPI VPA Handle'}</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Merchant UPI VPA ID</span>
                        <span className="font-mono font-bold text-green-800 block text-sm">{selectedAstrologer.upiId || 'kangleiastro@upi'}</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Bank & Account No.</span>
                        <span className="font-bold text-gray-900 block">{selectedAstrologer.bankName || 'State Bank of India'}</span>
                        <span className="font-mono font-bold text-gray-600 text-[11px] block">{selectedAstrologer.accountNo ? `Acc: ${selectedAstrologer.accountNo}` : 'Acc: 30847291823'}</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Bank IFSC Code</span>
                        <span className="font-mono font-bold text-blue-700 block text-sm">{selectedAstrologer.ifscCode || 'SBIN0001234'}</span>
                      </div>
                    </div>
                  </div>

                  {/* ROW 4: PLAN TIER & TOOL ACCESS PERMISSIONS */}
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-base text-[#b45309] border-b border-[#fde68a] pb-2 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#d97706]" />
                      <span>Empanelment Subscription Plan & Tools Access Permissions</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-amber-100/60 border border-amber-300 space-y-1">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">Empanelment Subscription Plan</span>
                        <span className="font-serif font-bold text-base text-[#0f172a] block">{selectedAstrologer.planTier || 'ADVANCE'} GURU</span>
                        <span className="text-[11px] font-extrabold text-[#b45309] block">
                          {selectedAstrologer.planTier === 'PRO' ? '90% Payout Share' : selectedAstrologer.planTier === 'BASIC' ? '70% Payout Share' : '80% Payout Share'}
                        </span>
                      </div>

                      <div className="sm:col-span-2 p-4 rounded-2xl bg-white border border-gray-200 space-y-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Granted Astrology Calculators & Tools Permissions</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(selectedAstrologer.allowedTools || DEFAULT_ASTRO_FORM.allowedTools).map((toolId) => (
                            <span key={toolId} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200">
                              ✓ {toolId}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ACTION BUTTONS BAR */}
                  <div className="flex flex-wrap justify-between items-center pt-6 border-t border-[#fde68a] gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('astrologers')}
                      className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 cursor-pointer"
                    >
                      ← Back to All Jyotishs Directory
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setNewPasswordInput(selectedAstrologer.password || '');
                          setShowPasswordUpdateModal(true);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Update Login Password</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingAstroId(selectedAstrologer.id);
                          setNewAstroForm({
                            ...DEFAULT_ASTRO_FORM,
                            avatar: selectedAstrologer.avatar || DEFAULT_ASTRO_FORM.avatar,
                            name: selectedAstrologer.name || '',
                            specialty: selectedAstrologer.specialty || '',
                            phone: selectedAstrologer.phone || selectedAstrologer.whatsappNo || '',
                            whatsappNo: selectedAstrologer.whatsappNo || '',
                            sameAsWhatsapp: selectedAstrologer.sameAsWhatsapp ?? true,
                            email: selectedAstrologer.email || '',
                            streetLane: selectedAstrologer.streetLane || '',
                            cityDistrict: selectedAstrologer.cityDistrict || 'Imphal West',
                            state: selectedAstrologer.state || 'Manipur',
                            pincode: selectedAstrologer.pincode || '795001',
                            experienceYears: selectedAstrologer.experienceYears || 10,
                            languages: selectedAstrologer.languages || ['Manipuri (Meiteilon)', 'English'],
                            username: selectedAstrologer.username || '',
                            password: selectedAstrologer.password || 'guru123',
                            address: selectedAstrologer.address || 'Imphal West, Manipur',
                            upiId: selectedAstrologer.upiId || '',
                            bankName: selectedAstrologer.bankName || 'State Bank of India (SBI)',
                            accountHolder: selectedAstrologer.accountHolder || selectedAstrologer.name,
                            accountNo: selectedAstrologer.accountNo || '',
                            ifscCode: selectedAstrologer.ifscCode || 'SBIN0001234',
                            payoutMethod: selectedAstrologer.payoutMethod || 'UPI',
                            planTier: selectedAstrologer.planTier || 'ADVANCE',
                            allowedTools: selectedAstrologer.allowedTools || DEFAULT_ASTRO_FORM.allowedTools,
                            status: selectedAstrologer.status || 'ACTIVE',
                          });
                          setActiveTab('add_astro');
                        }}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Full Profile →</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASSWORD UPDATE MODAL POPUP */}
          {showPasswordUpdateModal && selectedAstrologer && (
            <div className="fixed inset-0 z-50 bg-[#0f172a]/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-3xl border border-[#f3e8d2] p-6 space-y-4 text-xs font-sans text-[#0f172a] shadow-2xl relative">
                <div className="flex justify-between items-center pb-3 border-b border-[#fde68a]">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <h4 className="font-serif font-bold text-lg text-[#0f172a]">Update Login Password</h4>
                  </div>
                  <button type="button" onClick={() => setShowPasswordUpdateModal(false)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-gray-600 font-medium">
                    Update portal login password for <strong className="text-blue-900">{selectedAstrologer.name}</strong> (@{selectedAstrologer.username || 'username'}):
                  </p>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-900 mb-1">
                      New Portal Login Password *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter new password (e.g. guru2026)"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#eff6ff] text-[#0f172a] font-mono font-bold text-xs focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#fde68a]">
                  <button
                    type="button"
                    onClick={() => setShowPasswordUpdateModal(false)}
                    className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateAstrologerPassword(selectedAstrologer.id, newPasswordInput)}
                    className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
                  >
                    Save New Password →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5E: WEBSITE ASTROLOGERS DISPLAY CMS (Controlled for Home & Astrologers Page) */}
          {activeTab === 'astro_website' && (
            <div className="space-y-6">
              
              {/* TOP RATED ASTROLOGERS SECTION CMS FORM */}
              <div className="bg-white p-6 rounded-3xl border border-[#fde68a] space-y-4 shadow-md">
                <div className="flex flex-wrap justify-between items-center gap-4 border-b border-[#fde68a] pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#b45309] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#d97706]" />
                      <span>Top Rated Astrologers Section CMS Settings</span>
                    </h3>
                    <p className="text-xs text-gray-500">
                      Control headline, text accents, & 4-step verification tagline displayed on homepage & astrologers page
                    </p>
                  </div>

                  <button
                    onClick={handleSaveAstrologerSectionSettings}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Section Settings</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                      Section Title Prefix *
                    </label>
                    <input
                      type="text"
                      value={astrologerSectionSettings.title}
                      onChange={(e) => setAstrologerSectionSettings({ ...astrologerSectionSettings, title: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                      Highlighted Gold Text Accent *
                    </label>
                    <input
                      type="text"
                      value={astrologerSectionSettings.highlightText}
                      onChange={(e) => setAstrologerSectionSettings({ ...astrologerSectionSettings, highlightText: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-extrabold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                      Verification Subtitle Tagline *
                    </label>
                    <input
                      type="text"
                      value={astrologerSectionSettings.subtitleTagline}
                      onChange={(e) => setAstrologerSectionSettings({ ...astrologerSectionSettings, subtitleTagline: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-gray-700 text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Homepage & Astrologers Directory Rate & Action Button Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#fde68a]">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                      Show Per-Minute Rates on Website Cards (Home & Astrologers Page)?
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAstrologerSectionSettings({ ...astrologerSectionSettings, showRateOnHome: !astrologerSectionSettings.showRateOnHome })}
                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                          astrologerSectionSettings.showRateOnHome !== false
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-gray-100 text-gray-600 border-gray-300'
                        }`}
                      >
                        {astrologerSectionSettings.showRateOnHome !== false ? '🟢 Display Rates (e.g. ₹35/min)' : '⚪ Hide Rates on Website'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                      Action Buttons Mode (Homepage & Astrologers Page)
                    </label>
                    <select
                      value={astrologerSectionSettings.actionButtonType || 'both'}
                      onChange={(e) => setAstrologerSectionSettings({ ...astrologerSectionSettings, actionButtonType: e.target.value as any })}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                    >
                      <option value="both">💬 Chat & 📞 Call (Dual Buttons Side-by-Side)</option>
                      <option value="chat_only">💬 Chat Only (Single Full-Width Button)</option>
                      <option value="call_only">📞 Call Only (Single Full-Width Button)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ASTROLOGERS CARDS GRID FOR WEBSITE DISPLAY */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {(apiAstrologers.length > 0 ? apiAstrologers : astrologers).map((astro) => {
                  const isFeaturedOnHome = astro.showOnHome !== false;

                  return (
                    <div key={astro.id} className="p-5 rounded-3xl bg-white border border-[#fde68a] space-y-3 font-sans relative flex flex-col justify-between shadow-md">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 p-0.5 shrink-0 bg-white">
                              <img
                                src={astro.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80'}
                                alt={astro.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-[#0f172a] text-base leading-tight">{astro.name}</h4>
                              <p className="text-[11px] text-[#b45309] font-mono mt-0.5 font-bold">{astro.badge || 'Verified'}</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleShowOnHome(astro.id, isFeaturedOnHome)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-all shrink-0 cursor-pointer ${
                              isFeaturedOnHome
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-gray-100 text-gray-500 border-gray-300'
                            }`}
                            title="Toggle whether displayed in Homepage Top Astrologers section"
                          >
                            {isFeaturedOnHome ? '⭐ Featured on Home' : '⚪ Hidden from Home'}
                          </button>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2">{astro.specialty || (astro.specialties && astro.specialties.join(' · '))}</p>

                        <div className="pt-3 border-t border-[#fde68a] space-y-2 text-xs">
                          {/* Price Per Minute Control */}
                          <div className="flex items-center justify-between bg-[#fefcf6] p-2.5 rounded-xl border border-[#fde68a]">
                            <span className="text-gray-700 font-bold">Homepage Rate (₹/min):</span>
                            <div className="flex items-center gap-1">
                              <span className="text-[#b45309] font-bold">₹</span>
                              <input
                                type="number"
                                min={10}
                                max={500}
                                value={astro.pricePerMin || 35}
                                onChange={(e) => handleUpdateAstroRate(astro.id, Number(e.target.value))}
                                className="w-16 h-8 px-2 rounded-lg bg-white border border-gray-300 text-[#b45309] font-mono font-bold text-center text-xs focus:border-[#d97706] focus:outline-none"
                              />
                              <span className="text-[10px] text-gray-500 font-mono">/min</span>
                            </div>
                          </div>

                          <div className="flex justify-between text-gray-700">
                            <span>WhatsApp Contact:</span>
                            <span className="font-bold text-[#b45309] font-mono">{astro.whatsappPhone || astro.whatsappNo}</span>
                          </div>

                          {/* MANAGE ASTROLOGER TOOLS PERMISSIONS BUTTON */}
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => handleOpenToolModal(astro)}
                              className="w-full py-2 px-3 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] border border-[#fde68a] text-[#b45309] font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
                                <span>Tool Access Permissions</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-white text-[#b45309] text-[10px] font-extrabold border border-[#fde68a]">
                                {astro.allowedTools ? astro.allowedTools.length : 19}/19 Allowed
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5B: ASTROLOGER WALLETS & PAYOUT DISBURSEMENT */}
          {activeTab === 'astro_payouts' && (
            <div className="bg-[#1c2541] rounded-2xl border border-[#3a506b]/40 shadow-md p-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#3a506b]/40">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#faf8f4]">Astrologer Wallet Balances & Commission Payouts</h3>
                  <p className="text-xs text-[#5c7a99] font-sans">Monitor online astrologers, consultation counts, wallet balances, pending payout requests, and process UPI disbursements</p>
                </div>
              </div>

              {/* 4 KPI SUMMARY CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border ${
                  theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-amber-50/70 border-amber-200 text-slate-900'
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-400">Total Wallet Balance Pending</span>
                  <div className="font-mono font-extrabold text-2xl text-amber-600 dark:text-[#fbbf24] mt-1">
                    ₹{astrologers.reduce((s, a) => s + (a.pendingPayout || 0), 0).toLocaleString()}
                  </div>
                  <span className="text-[10px] block mt-1 text-gray-400">Across all {astrologers.length} empaneled Gurus</span>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-purple-50/70 border-purple-200 text-slate-900'
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-purple-300">Payout Requests Submitted</span>
                  <div className="font-mono font-extrabold text-2xl text-purple-600 dark:text-purple-300 mt-1">
                    {astrologers.filter((a) => a.payoutStatus === 'REQUESTED' || a.pendingPayout > 0).length} Astrologers
                  </div>
                  <span className="text-[10px] block mt-1 text-gray-400">Ready for UPI / Bank Disbursement</span>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-emerald-50/70 border-emerald-200 text-slate-900'
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-green-400">Total Disbursed (Paid Out)</span>
                  <div className="font-mono font-extrabold text-2xl text-green-600 dark:text-green-400 mt-1">
                    ₹{astrologers.reduce((s, a) => s + (a.totalPaidOut || 9250), 0).toLocaleString()}
                  </div>
                  <span className="text-[10px] block mt-1 text-gray-400">Lifetime completed payouts</span>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-sky-50/70 border-sky-200 text-slate-900'
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-sky-300">Total Gross Astrologer Earnings</span>
                  <div className="font-mono font-extrabold text-2xl text-sky-600 dark:text-sky-300 mt-1">
                    ₹{astrologers.reduce((s, a) => s + (a.totalEarnings || 12750), 0).toLocaleString()}
                  </div>
                  <span className="text-[10px] block mt-1 text-gray-400">Consultations + E-store sales</span>
                </div>
              </div>

              {/* ASTROLOGERS FINANCIAL PAYOUT TABLE */}
              <div className="rounded-3xl border border-[#fde68a] overflow-hidden shadow-xl bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="bg-[#fef3c7] text-[#78350f] font-serif font-extrabold uppercase tracking-wider text-xs border-b border-[#fde68a]">
                        <th className="p-4">Online Astrologer Guru</th>
                        <th className="p-4">Specialty & Phone</th>
                        <th className="p-4 text-center">Readings Done</th>
                        <th className="p-4">Gross Earnings (₹)</th>
                        <th className="p-4">Total Paid Out (₹)</th>
                        <th className="p-4">Wallet Balance / Pending (₹)</th>
                        <th className="p-4 text-center">Payout Status</th>
                        <th className="p-4 text-right">Admin Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#fde68a] text-[#0f172a]">
                      {astrologers.map((astro) => {
                        const grossEarn = astro.totalEarnings || (astro.completedCount * 350 + astro.pendingPayout);
                        const paidOut = astro.totalPaidOut || Math.max(0, grossEarn - astro.pendingPayout);
                        const isRequested = astro.payoutStatus === 'REQUESTED' || astro.pendingPayout > 0;

                        return (
                          <tr key={astro.id} className="transition-colors hover:bg-[#fefcf6] odd:bg-white even:bg-[#fefcf6]">
                            <td className="p-4">
                              <div className="font-serif font-extrabold text-base text-[#0f172a]">
                                {astro.name}
                              </div>
                              <div className="inline-block mt-1">
                                <span className="text-xs font-mono font-extrabold text-[#b45309] bg-[#fef3c7] border border-[#fde68a] px-2.5 py-0.5 rounded-md shadow-xs">
                                  @{astro.username || astro.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}
                                </span>
                              </div>
                              <div className="mt-1.5">
                                <a
                                  href={`https://wa.me/${astro.whatsappNo.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-3 py-1 rounded-lg font-mono font-extrabold hover:underline inline-flex items-center gap-1.5 shadow-xs transition-all"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>{astro.whatsappNo}</span>
                                </a>
                              </div>
                            </td>

                            <td className="p-4">
                              <span className="text-xs font-extrabold block text-[#b45309]">
                                {astro.specialty}
                              </span>
                              <span className="text-xs text-gray-600 font-mono font-bold block mt-1">📞 {astro.phone}</span>
                            </td>

                            <td className="p-4 text-center font-mono font-bold">
                              <span className="px-3 py-1.5 rounded-full bg-[#fef3c7] text-[#b45309] border border-[#fde68a] font-extrabold text-xs shadow-xs">
                                {astro.completedCount} Consultations
                              </span>
                            </td>

                            <td className="p-4 font-mono font-extrabold text-sky-800 text-sm">
                              ₹{grossEarn.toLocaleString()}
                            </td>

                            <td className="p-4 font-mono font-extrabold text-emerald-700 text-sm">
                              ₹{paidOut.toLocaleString()}
                            </td>

                            <td className="p-4 font-mono font-extrabold text-base text-[#b45309] bg-[#fef3c7] px-3 py-2 rounded-xl border border-[#fde68a]">
                              ₹{astro.pendingPayout.toLocaleString()}
                            </td>

                            <td className="p-4 text-center">
                              {isRequested ? (
                                <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold border border-amber-300 shadow-xs animate-pulse inline-flex items-center gap-1">
                                  <span>⏳ Payout Requested</span>
                                </span>
                              ) : (
                                <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-300 shadow-xs inline-flex items-center gap-1">
                                  ✅ All Settled
                                </span>
                              )}
                              {astro.lastPayoutUtr && (
                                <span className="text-xs text-gray-500 font-mono block mt-1">
                                  Last UTR: {astro.lastPayoutUtr}
                                </span>
                              )}
                            </td>

                            <td className="p-4 text-right">
                              <button
                                onClick={() => {
                                  setPayoutModalAstro(astro);
                                  setPayoutForm({
                                    amount: astro.pendingPayout || 1000,
                                    paymentMethod: 'GPay / PhonePe UPI',
                                    utr: 'UPI-' + Math.floor(1000000000 + Math.random() * 900000000),
                                    notes: 'Monthly Astrologer Commission Disbursement',
                                  });
                                }}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md inline-flex items-center gap-1.5 cursor-pointer border border-emerald-400/30 transition-all hover:scale-105"
                              >
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>💳 Process Payout</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PAYOUT DISBURSEMENT MODAL */}
              {payoutModalAstro && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPayoutModalAstro(null)} />
                  <div className="relative w-full max-w-md bg-[#1c2541] rounded-2xl border border-[#3a506b] shadow-2xl p-6 space-y-4 z-10 text-xs">
                    <div className="flex justify-between items-center pb-3 border-b border-[#3a506b]">
                      <div>
                        <h4 className="font-serif font-bold text-lg text-[#fbbf24]">Disburse Payout to Astrologer</h4>
                        <p className="text-gray-400 text-[11px]">{payoutModalAstro.name} ({payoutModalAstro.whatsappNo})</p>
                      </div>
                      <button onClick={() => setPayoutModalAstro(null)} className="text-gray-400 hover:text-white p-1">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleConfirmPayoutDisbursement} className="space-y-4 font-sans">
                      <div className="bg-[#0b132b] p-3 rounded-xl border border-[#3a506b] flex justify-between items-center">
                        <span className="text-gray-400">Available Wallet Balance:</span>
                        <span className="font-mono font-bold text-base text-green-400">₹{payoutModalAstro.pendingPayout.toLocaleString()}</span>
                      </div>

                      <div>
                        <label className="block text-gray-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                          Payout Amount (₹)<span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          max={payoutModalAstro.pendingPayout}
                          value={payoutForm.amount || ''}
                          onChange={(e) => setPayoutForm({ ...payoutForm, amount: Number(e.target.value) })}
                          className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-[#fbbf24] font-mono font-bold text-sm focus:border-[#d97706] focus:outline-none"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">This amount will be deducted directly from the astrologer&apos;s wallet balance.</p>
                      </div>

                      <div>
                        <label className="block text-gray-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                          Payment Method<span className="text-red-400">*</span>
                        </label>
                        <select
                          value={payoutForm.paymentMethod}
                          onChange={(e) => setPayoutForm({ ...payoutForm, paymentMethod: e.target.value })}
                          className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-medium text-xs focus:border-[#d97706] focus:outline-none"
                        >
                          <option value="GPay / PhonePe UPI">GPay / PhonePe UPI Direct</option>
                          <option value="Paytm / BHIM UPI">Paytm / BHIM UPI</option>
                          <option value="Bank NEFT / IMPS Transfer">Bank NEFT / IMPS Transfer</option>
                          <option value="Cash / Manual Settlement">Cash / Manual Settlement</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                          Transaction UTR / Reference Number<span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 42981099238"
                          value={payoutForm.utr}
                          onChange={(e) => setPayoutForm({ ...payoutForm, utr: e.target.value })}
                          className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-sky-300 font-mono text-xs focus:border-[#d97706] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                          Notes / Description
                        </label>
                        <input
                          type="text"
                          placeholder="Payout remarks"
                          value={payoutForm.notes}
                          onChange={(e) => setPayoutForm({ ...payoutForm, notes: e.target.value })}
                          className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white text-xs focus:border-[#d97706] focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-[#3a506b]">
                        <button
                          type="button"
                          onClick={() => setPayoutModalAstro(null)}
                          className="px-4 py-2.5 rounded-xl bg-[#0b132b] text-gray-300 font-bold text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95"
                        >
                          Confirm & Deduct ₹{payoutForm.amount.toLocaleString()} From Wallet
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5C: ASTROLOGER ASSIGN LIST (DEDICATED VIEW) */}
          {activeTab === 'astro_assign_list' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl space-y-6 text-left font-sans">
              <div className="flex flex-wrap justify-between items-center pb-4 border-b border-[#fde68a] gap-3">
                <div>
                  <span className="px-3.5 py-1 rounded-full bg-[#fef3c7] text-[#b45309] font-extrabold text-[10px] uppercase tracking-wider border border-[#fde68a] inline-block mb-1">
                    Guru & Jyotish Dispatching
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Astrologers Assigned Orders List</h3>
                  <p className="text-xs text-gray-500">Track Kuthi, Numit Yengba, and Matching orders assigned to empaneled Gurus</p>
                </div>
                <button
                  onClick={() => setShowAddAstroModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Jyotish</span>
                </button>
              </div>

              {/* KPI Stat Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Total Assigned Orders</span>
                  <div className="text-2xl font-black text-[#b45309] font-mono mt-1">
                    {orders.filter(o => o.assignedAstrologerId || o.status === 'ASSIGNED').length}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Pending Analysis</span>
                  <div className="text-2xl font-black text-amber-600 font-mono mt-1">
                    {orders.filter(o => (o.assignedAstrologerId || o.status === 'ASSIGNED') && o.status !== 'COMPLETED').length}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Reports Received & Delivered</span>
                  <div className="text-2xl font-black text-green-600 font-mono mt-1">
                    {orders.filter(o => o.status === 'COMPLETED' || o.reportReceivedFromAstro).length}
                  </div>
                </div>
              </div>

              {/* ASSIGNED ORDERS TABLE */}
              <div className="rounded-2xl border border-[#fde68a] overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#fef3c7] text-[#78350f] font-serif font-bold uppercase tracking-wider border-b border-[#fde68a]">
                    <tr>
                      <th className="p-3.5">Order Ref & Service</th>
                      <th className="p-3.5">Client Particulars</th>
                      <th className="p-3.5">Assigned Jyotish Guru</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#fde68a] bg-white">
                    {orders.filter(o => o.assignedAstrologerId || o.status === 'ASSIGNED').length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-400 font-bold">
                          No assigned orders found yet. Select an order in Kuthi Orders Hub to assign an Astrologer.
                        </td>
                      </tr>
                    ) : (
                      orders.filter(o => o.assignedAstrologerId || o.status === 'ASSIGNED').map((o) => (
                        <tr key={o.id} className="hover:bg-[#fefcf6]">
                          <td className="p-3.5">
                            <span className="font-mono font-bold text-[#b45309] block">{o.orderRef}</span>
                            <span className="text-gray-600 font-bold text-[11px]">{o.serviceType}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-[#0f172a] block">{o.clientName} ({o.sex})</span>
                            <span className="text-gray-500 font-mono text-[10px]">{o.whatsappNo}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-serif font-bold text-[#d97706] block">
                              🙏 {o.assignedAstrologerName || 'Assigned Astrologer'}
                            </span>
                            <span className="text-[10px] text-gray-400">Guru Assigned</span>
                          </td>
                          <td className="p-3.5 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                              o.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]'
                            }`}>
                              {o.status === 'COMPLETED' ? '✓ Completed' : '⏳ In Analysis'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <a
                              href={`https://wa.me/${(o.whatsappNo || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(o.clientName)},%20your%20Kuthi%20report%20is%20being%20processed%20by%20${encodeURIComponent(o.assignedAstrologerName || 'our Acharya')}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] inline-flex items-center gap-1 shadow-xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5B: DEDICATED WEBSITE SERVICES CMS (Add Services, Rates & Sub-Services Matrix) */}
          {(activeTab === 'astro_services' || activeTab === 'astro_rates') && (
            <div className="space-y-6">
              
              {/* TOP CARD: ADD NEW SERVICE PACKAGE FORM */}
              <div className="bg-white p-6 rounded-3xl border border-[#fde68a] shadow-md space-y-5 text-[#0f172a]">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#fde68a] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white flex items-center justify-center font-bold shadow-md">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-[#b45309]">
                        Add New Service Package / Consultation Category
                      </h3>
                      <p className="text-xs text-gray-500">
                        Create and publish a new astrology consultation service live on the website
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddServiceModal(true)}
                    className="px-5 py-2 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#b45309] font-bold text-xs border border-[#fde68a] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-[#d97706]" />
                    <span>Open Add Modal</span>
                  </button>
                </div>

                <form onSubmit={handleCreateNewServicePackage} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                        Service Package Name / Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Manglik Dasha & Marriage Compatibility Audit"
                        value={newServiceForm.title}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, title: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                        Tag Badge Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. POPULAR / SPECIAL"
                        value={newServiceForm.badge}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, badge: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-extrabold text-xs uppercase focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                        Client Price (₹) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ₹1,499"
                        value={newServiceForm.price}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, price: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-extrabold text-sm font-mono focus:border-[#d97706] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                        Astrologer Payout Fee (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 900"
                        value={newServiceForm.astroPayoutFee}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, astroPayoutFee: parseInt(e.target.value) || 0 })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-emerald-700 font-extrabold text-sm font-mono focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                      Description / Highlights Copy *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Describe what the client receives in this service package..."
                      value={newServiceForm.description}
                      onChange={(e) => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] text-xs focus:border-[#d97706] focus:outline-none font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                        Button CTA Label Text
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Book Consultation"
                        value={newServiceForm.cta}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, cta: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                        Button Target Link / URL
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. /matching or /booking"
                        value={newServiceForm.link}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, link: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-blue-700 font-mono text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 cursor-pointer flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Publish New Service Live</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* BOTTOM CARD: ACTIVE SERVICE CATALOG & RATE MATRIX */}
              <div className="bg-white rounded-3xl border border-[#fde68a] shadow-md p-6 space-y-6 text-[#0f172a]">
                <div className="flex justify-between items-center pb-4 border-b border-[#fde68a]">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-[#b45309]">Active Service Rate Matrix & Sub-Services ({services.length})</h3>
                    <p className="text-xs text-gray-500 font-sans">Manage service pricing, astrologer payouts, platform commission splits, and specific sub-service options</p>
                  </div>

                  <button
                    onClick={handleSaveServices}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Services Live</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-sans">
                    <thead>
                      <tr className="bg-[#fef3c7] text-[#78350f] uppercase tracking-wider font-extrabold text-[10px] border-b border-[#fde68a]">
                        <th className="px-4 py-3.5">Service Title & Badge</th>
                        <th className="px-4 py-3.5">Client Price (₹)</th>
                        <th className="px-4 py-3.5">Astrologer Fee (₹)</th>
                        <th className="px-4 py-3.5">Platform Net Share (₹)</th>
                        <th className="px-4 py-3.5">Commission Split (%)</th>
                        <th className="px-4 py-3.5">Button CTA Label & Link</th>
                        <th className="px-4 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-[#0f172a]">
                      {services.map((serv) => {
                        const clientPriceNum = parseInt(serv.price.replace(/[^\d]/g, '')) || 0;
                        const payoutNum = serv.astroPayoutFee || Math.round(clientPriceNum * 0.6);
                        const platformShare = Math.max(0, clientPriceNum - payoutNum);
                        const astroPct = clientPriceNum > 0 ? Math.round((payoutNum / clientPriceNum) * 100) : 0;

                        return (
                          <React.Fragment key={serv.id}>
                            <tr className="hover:bg-[#fefcf6] transition-colors">
                              {/* Service Title & Badge inputs */}
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={serv.title}
                                    onChange={(e) => handleServiceChange(serv.id, 'title', e.target.value)}
                                    className="w-56 h-9 px-2.5 rounded-lg border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                                    placeholder="Package Title"
                                  />
                                  <input
                                    type="text"
                                    value={serv.badge}
                                    onChange={(e) => handleServiceChange(serv.id, 'badge', e.target.value)}
                                    className="w-24 h-9 px-2 rounded-lg border border-gray-300 bg-[#fef3c7] text-[#b45309] font-extrabold text-[10px] uppercase text-center focus:border-[#d97706] focus:outline-none"
                                    placeholder="Badge"
                                  />
                                </div>
                              </td>

                              {/* Client Price input */}
                              <td className="px-4 py-3 font-mono font-bold">
                                <input
                                  type="text"
                                  value={serv.price}
                                  onChange={(e) => handleServiceChange(serv.id, 'price', e.target.value)}
                                  className="w-24 h-9 px-2 rounded-lg border border-gray-300 bg-[#fefcf6] text-[#b45309] font-extrabold text-xs font-mono focus:border-[#d97706] focus:outline-none"
                                />
                              </td>

                              {/* Astrologer Payout Fee input */}
                              <td className="px-4 py-3 font-mono">
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500 font-bold">₹</span>
                                  <input
                                    type="number"
                                    value={payoutNum}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 0;
                                      setServices((prev) =>
                                        prev.map((s) => (s.id === serv.id ? { ...s, astroPayoutFee: val } : s))
                                      );
                                    }}
                                    className="w-24 h-9 px-2 rounded-lg border border-gray-300 bg-[#fefcf6] text-emerald-700 font-extrabold font-mono text-xs focus:border-[#d97706] focus:outline-none"
                                  />
                                </div>
                              </td>

                              {/* Platform Net Share */}
                              <td className="px-4 py-3 font-mono font-bold text-blue-700">
                                ₹{platformShare.toLocaleString()}
                              </td>

                              {/* Commission Split % input */}
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={astroPct}
                                    onChange={(e) => {
                                      const pct = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                      const newPayout = Math.round((clientPriceNum * pct) / 100);
                                      setServices((prev) =>
                                        prev.map((s) => (s.id === serv.id ? { ...s, astroPayoutFee: newPayout } : s))
                                      );
                                    }}
                                    className="w-16 h-9 px-2 rounded-lg border border-gray-300 bg-[#fefcf6] text-green-800 font-extrabold text-center text-xs focus:border-[#d97706] focus:outline-none"
                                  />
                                  <span className="text-xs font-bold text-gray-700">%</span>
                                </div>
                              </td>

                              {/* Button CTA Text & Page Assignment inputs */}
                              <td className="px-4 py-3">
                                <div className="flex flex-col gap-1">
                                  <input
                                    type="text"
                                    value={serv.cta}
                                    onChange={(e) => handleServiceChange(serv.id, 'cta', e.target.value)}
                                    className="w-44 h-8 px-2 rounded-lg border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                                    placeholder="Button Text"
                                  />
                                  <select
                                    value={serv.pageTarget || (serv.link?.includes('/manipuri_kuthi_yengba') ? '/manipuri_kuthi_yengba' : serv.link === '/manipuri_kuthi' ? '/manipuri_kuthi' : serv.link?.includes('/numit_leppa_yengba') ? '/numit_leppa_yengba' : serv.link === '/matching' ? '/matching' : 'all')}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setServices((prev) =>
                                        prev.map((s) => (s.id === serv.id ? { ...s, pageTarget: val as any, link: val !== 'all' ? val : s.link } : s))
                                      );
                                    }}
                                    className="w-44 h-8 px-2 rounded-lg border border-gray-300 bg-[#fefcf6] text-[11px] font-bold text-[#b45309] focus:border-[#d97706] focus:outline-none"
                                  >
                                    <option value="/manipuri_kuthi_yengba">Page: /manipuri_kuthi_yengba</option>
                                    <option value="/manipuri_kuthi">Page: /manipuri_kuthi</option>
                                    <option value="/numit_leppa_yengba">Page: /numit_leppa_yengba (Numit Yengba)</option>
                                    <option value="/matching">Page: /matching</option>
                                    <option value="all">Page: All / General</option>
                                  </select>
                                </div>
                              </td>

                              {/* Delete button */}
                              <td className="px-4 py-3 text-right">
                                {services.length > 1 && (
                                  <button
                                    onClick={() => setServices((prev) => prev.filter((s) => s.id !== serv.id))}
                                    className="p-1.5 text-red-500 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                                    title="Delete Package"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </td>
                            </tr>

                            {/* SUB-SERVICES MANAGER INNER ROW */}
                            <tr key={`${serv.id}-subs`} className="bg-[#fefcf6]">
                              <td colSpan={7} className="px-6 py-4 border-b border-gray-200">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#b45309]">
                                      <Sparkles className="w-4 h-4 text-[#d97706]" />
                                      <span>Sub-Services & Specific Pricing Menu for "{serv.title}"</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleAddSubService(serv.id)}
                                      className="px-3 py-1.5 rounded-lg bg-[#d97706] hover:bg-[#b45309] text-white font-extrabold text-xs flex items-center gap-1 transition-all cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>+ Add Sub-Service Option</span>
                                    </button>
                                  </div>

                                  {(!serv.subServices || serv.subServices.length === 0) ? (
                                    <p className="text-xs text-gray-500 italic">No sub-services defined for this category yet.</p>
                                  ) : (
                                    <div className="space-y-2">
                                      {serv.subServices.map((sub) => (
                                        <div key={sub.id} className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#fde68a] text-xs shadow-xs">
                                          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
                                            <input
                                              type="text"
                                              value={sub.title}
                                              onChange={(e) => handleUpdateSubService(serv.id, sub.id, 'title', e.target.value)}
                                              className="w-full sm:w-80 h-9 px-3 rounded-lg border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                                              placeholder="Sub-Service Option Title"
                                            />
                                            <div className="flex items-center gap-1.5 shrink-0">
                                              <span className="font-bold text-[#b45309]">Price (₹):</span>
                                              <input
                                                type="number"
                                                value={sub.price}
                                                onChange={(e) => handleUpdateSubService(serv.id, sub.id, 'price', e.target.value)}
                                                className="w-24 h-9 px-2.5 rounded-lg border border-gray-300 bg-[#fefcf6] text-[#b45309] font-mono font-extrabold text-xs focus:border-[#d97706] focus:outline-none"
                                              />
                                            </div>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveSubService(serv.id, sub.id)}
                                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            title="Remove Sub-service"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB: CLIENT BASE / USER DIRECTORY */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-2xl border border-[#f3e8d2] shadow-sm">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a] flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#d97706]" />
                    <span>Client Base & Customer Directory</span>
                  </h3>
                  <p className="text-xs text-gray-500">Manage registered client accounts, view consultation history, saved birth charts, & contact details</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddClientModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Register New Client Account</span>
                  </button>
                </div>
              </div>

              {/* KPI STATS ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#fde68a] text-[#0f172a] space-y-1 shadow-xs">
                  <span className="text-[10px] font-bold text-[#b45309] uppercase tracking-wider block">Total Registered Clients</span>
                  <div className="font-mono font-extrabold text-2xl text-[#b45309]">{clientBase.length}</div>
                  <span className="text-[10px] text-gray-500 block">Verified user accounts</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#fde68a] text-[#0f172a] space-y-1 shadow-xs">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Consultations Booked</span>
                  <div className="font-mono font-extrabold text-2xl text-purple-700">{clientBase.reduce((s, c) => s + c.totalOrders, 0)}</div>
                  <span className="text-[10px] text-gray-500 block">Lifetime Kuthi consultations</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#fde68a] text-[#0f172a] space-y-1 shadow-xs">
                  <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider block">Total Client Revenue</span>
                  <div className="font-mono font-extrabold text-2xl text-green-700">₹{clientBase.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}</div>
                  <span className="text-[10px] text-gray-500 block">Consultation fees paid</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#fde68a] text-[#0f172a] space-y-1 shadow-xs">
                  <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">Saved Birth Kundli Charts</span>
                  <div className="font-mono font-extrabold text-2xl text-sky-700">{clientBase.reduce((s, c) => s + c.savedKundlisCount, 0)}</div>
                  <span className="text-[10px] text-gray-500 block">Calculated & stored charts</span>
                </div>
              </div>

              {/* SEARCH & FILTER BAR */}
              <div className="bg-white p-4 rounded-2xl border border-[#f3e8d2] flex flex-wrap gap-4 items-center justify-between shadow-xs">
                <div className="relative flex-1 min-w-[260px]">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search client by name, email, phone, or location..."
                    value={clientSearchTerm}
                    onChange={(e) => setClientSearchTerm(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] text-xs focus:border-[#d97706] focus:outline-none"
                  />
                </div>
              </div>

              {/* REGISTER NEW CLIENT FORM MODAL */}
              {showAddClientModal && (
                <div className="bg-[#fefcf6] p-5 rounded-2xl border border-[#fde68a] space-y-4 text-xs shadow-md">
                  <div className="flex justify-between items-center border-b border-[#fde68a] pb-2">
                    <h4 className="font-bold text-[#b45309] text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#d97706]" />
                      Register & Create Client User Record
                    </h4>
                    <button type="button" onClick={() => setShowAddClientModal(false)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleRegisterNewClient} className="space-y-3 font-sans text-[#0f172a]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#b45309] uppercase mb-1">Client Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={newClientForm.name}
                          onChange={(e) => setNewClientForm({ ...newClientForm, name: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-[#0f172a] font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#b45309] uppercase mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="client@example.com"
                          value={newClientForm.email}
                          onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-sky-800 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#b45309] uppercase mb-1">Phone / WhatsApp *</label>
                        <input
                          type="text"
                          required
                          placeholder="+91 98620 00000"
                          value={newClientForm.phone}
                          onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value, whatsappNo: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-[#b45309] font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#b45309] uppercase mb-1">Gender / Sex</label>
                        <select
                          value={newClientForm.sex}
                          onChange={(e) => setNewClientForm({ ...newClientForm, sex: e.target.value as any })}
                          className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-[#0f172a] text-xs"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-[#b45309] uppercase mb-1">Address / Location</label>
                        <input
                          type="text"
                          placeholder="City, District, State"
                          value={newClientForm.address}
                          onChange={(e) => setNewClientForm({ ...newClientForm, address: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-[#0f172a] text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-[#fde68a]">
                      <button type="button" onClick={() => setShowAddClientModal(false)} className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold cursor-pointer">Cancel</button>
                      <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold cursor-pointer">Save Client Account →</button>
                    </div>
                  </form>
                </div>
              )}



              {/* CLIENT BASE TABLE */}
              <div className="bg-white rounded-3xl border border-[#fde68a] shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs text-[#0f172a]">
                    <thead>
                      <tr className="bg-[#fef3c7] border-b border-[#fde68a] text-[#78350f] font-serif uppercase tracking-wider">
                        <th className="p-4">Client Name</th>
                        <th className="p-4">Contact Info (Email & Phone)</th>
                        <th className="p-4">Gender & Location</th>
                        <th className="p-4 text-center">Orders & Spent</th>
                        <th className="p-4 text-center">Saved Kundlis</th>
                        <th className="p-4 text-center">Joined Date</th>
                        <th className="p-4 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#fde68a] text-[#0f172a]">
                      {clientBase
                        .filter(
                          (c) =>
                            c.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                            c.email.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                            c.phone.includes(clientSearchTerm) ||
                            c.address.toLowerCase().includes(clientSearchTerm.toLowerCase())
                        )
                        .map((client) => (
                          <tr key={client.id} className="hover:bg-[#fefcf6] transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#b45309] to-[#d97706] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                                  {client.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-extrabold text-sm text-[#0f172a]">{client.name}</div>
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold border border-emerald-300">
                                    {client.status}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-gray-700 font-medium">{client.email}</div>
                              <a
                                href={`https://wa.me/${client.whatsappNo.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-green-400 font-mono font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>{client.phone}</span>
                              </a>
                            </td>
                            <td className="p-4">
                              <span className="text-amber-300 font-semibold">{client.sex}</span>
                              <div className="text-[11px] text-gray-400 truncate max-w-[180px]">{client.address}</div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="font-bold text-white">{client.totalOrders} Orders</div>
                              <div className="font-mono text-green-400 font-extrabold">₹{client.totalSpent.toLocaleString()}</div>
                            </td>
                            <td className="p-4 text-center">
                              <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold font-mono">
                                📜 {client.savedKundlisCount} Charts
                              </span>
                            </td>
                            <td className="p-4 text-center font-mono text-gray-400">
                              {client.joinedAt}
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => setInspectingClient(client)}
                                className="px-3 py-1.5 rounded-xl bg-[#0b132b] hover:bg-[#334155] border border-[#3a506b] text-[#fbbf24] font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect Profile</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* INSPECT CLIENT PROFILE MODAL */}
          {inspectingClient && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
              <div className="bg-[#1c2541] rounded-3xl border border-[#3a506b] shadow-2xl max-w-lg w-full p-6 space-y-4 text-white text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-[#3a506b]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#d97706] text-white flex items-center justify-center font-bold text-base">
                      {inspectingClient.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#fbbf24]">{inspectingClient.name}</h4>
                      <span className="text-gray-400 text-xs">{inspectingClient.email}</span>
                    </div>
                  </div>
                  <button onClick={() => setInspectingClient(null)} className="text-gray-400 hover:text-white p-1 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 font-sans">
                  <div className="grid grid-cols-2 gap-3 bg-[#0b132b] p-3 rounded-xl border border-[#3a506b]">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">WhatsApp Contact</span>
                      <span className="font-mono text-green-400 font-bold">{inspectingClient.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Gender & Address</span>
                      <span className="text-amber-300 font-bold">{inspectingClient.sex} · {inspectingClient.address}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Consultations Placed</span>
                      <span className="font-bold text-white">{inspectingClient.totalOrders} Orders (₹{inspectingClient.totalSpent})</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Account Registration Date</span>
                      <span className="font-mono text-gray-300">{inspectingClient.joinedAt}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <a
                      href={`https://wa.me/${inspectingClient.whatsappNo.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inspectingClient.name}, this is KangleiAstro Customer Support.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs inline-flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Contact Client on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setInspectingClient(null)}
                      className="px-4 py-2 rounded-xl bg-gray-700 text-gray-200 font-bold text-xs cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SITE SETTINGS & UPI QR CONFIGURATION */}
          {(activeTab === 'settings' || activeTab === 'upi') && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-2xl border border-[#f3e8d2] shadow-sm">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Header Support Bar & Merchant UPI QR Settings</h3>
                  <p className="text-xs text-gray-500">Manage website top support header, customer helpline info, UPI merchant handles & payment QR codes</p>
                </div>
                <button
                  onClick={handleSaveSiteSettings}
                  disabled={savingSettings}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSettings ? 'Saving Settings...' : 'Save Header & UPI QR Settings Live →'}</span>
                </button>
              </div>

              {/* CARD 1: TOP BAR CUSTOMER SUPPORT HEADER CMS */}
              <div className="bg-white p-6 rounded-3xl border border-[#fde68a] space-y-5 text-xs text-[#0f172a] shadow-md">
                <div className="flex items-center justify-between border-b border-[#fde68a] pb-3">
                  <h4 className="font-serif font-bold text-xl text-[#b45309] flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-[#d97706]" />
                    <span>Top Support Header Bar CMS</span>
                  </h4>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase border border-amber-300">
                    Live Header Sync
                  </span>
                </div>

                {/* Real-time Simulated Top Bar Preview Box */}
                <div className="space-y-1.5">
                  <span className="font-extrabold text-[10px] text-[#b45309] uppercase tracking-wider block">Real-Time Header Preview (As Visitors See It):</span>
                  <div className="bg-[#fef3c7] text-[#78350f] p-3 rounded-2xl border border-[#fde68a] flex flex-wrap items-center justify-between text-xs font-medium gap-3">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Headphones className="w-3.5 h-3.5 text-[#b45309]" />
                        <span>{siteSettings.headerSettings.supportTiming || 'Live Support (9:30 AM – 6:00 PM IST)'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#b45309]" />
                        <span className="underline">{siteSettings.headerSettings.supportEmail || 'ccare@kangleiastro.com'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-extrabold">
                        <Phone className="w-3.5 h-3.5 text-[#b45309]" />
                        <span className="underline">{siteSettings.headerSettings.supportPhone || '+91 98765 43210'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">Top Utility Bar</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                      Support Timing Text *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Live Support (9:30 AM – 6:00 PM IST)"
                      value={siteSettings.headerSettings.supportTiming}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        headerSettings: { ...siteSettings.headerSettings, supportTiming: e.target.value }
                      })}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                      Customer Care Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ccare@kangleiastro.com"
                      value={siteSettings.headerSettings.supportEmail}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        headerSettings: { ...siteSettings.headerSettings, supportEmail: e.target.value }
                      })}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-blue-700 font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                      Helpline Phone / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 43210"
                      value={siteSettings.headerSettings.supportPhone}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        headerSettings: { ...siteSettings.headerSettings, supportPhone: e.target.value }
                      })}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-green-700 font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2: MERCHANT PAYMENT UPI VPA ID & QR CODE UPLOADER CMS */}
              <div className="bg-white p-6 rounded-3xl border border-[#fde68a] space-y-5 text-xs text-[#0f172a] shadow-md">
                <div className="flex items-center justify-between border-b border-[#fde68a] pb-3">
                  <h4 className="font-serif font-bold text-xl text-[#b45309] flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <span>Merchant UPI Payment ID & QR Code Image Uploader</span>
                  </h4>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[10px] uppercase border border-emerald-300">
                    UPI Merchant Active
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  {/* Form Inputs (2 Cols) */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                          Official Merchant UPI VPA ID *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. kangleiastro@upi or 9862099881@ybl"
                          value={siteSettings.upiSettings.upiId}
                          onChange={(e) => setSiteSettings({
                            ...siteSettings,
                            upiSettings: { ...siteSettings.upiSettings, upiId: e.target.value }
                          })}
                          className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-green-800 font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                          Payee / Account Holder Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. KangleiAstro Services"
                          value={siteSettings.upiSettings.payeeName}
                          onChange={(e) => setSiteSettings({
                            ...siteSettings,
                            upiSettings: { ...siteSettings.upiSettings, payeeName: e.target.value }
                          })}
                          className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* QR Code Image Uploader */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309]">
                        Upload Payment QR Code Image File
                      </label>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <label className="flex-1 w-full px-4 py-3 border-2 border-dashed border-[#d97706]/40 hover:border-[#d97706] bg-[#fefcf6] rounded-2xl cursor-pointer text-center transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleQRImageUpload}
                            className="hidden"
                          />
                          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#b45309]">
                            <Upload className="w-4 h-4 text-[#d97706]" />
                            <span>Click here to upload QR image file from phone / computer</span>
                          </div>
                          <span className="text-[10px] text-gray-500 block mt-0.5">Supports PNG, JPG, JPEG, WEBP QR code image scans</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            const genUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=${siteSettings.upiSettings.upiId}&pn=${siteSettings.upiSettings.payeeName}`)}`;
                            setSiteSettings({
                              ...siteSettings,
                              upiSettings: { ...siteSettings.upiSettings, qrImageUrl: genUrl }
                            });
                          }}
                          className="shrink-0 px-4 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-[#b45309] font-extrabold text-xs border border-[#fde68a] transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles className="w-4 h-4 text-[#d97706]" />
                          <span>Auto-Generate QR</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                        QR Code Image URL / Base64 Data
                      </label>
                      <input
                        type="text"
                        placeholder="https://... or data:image/png;base64,..."
                        value={siteSettings.upiSettings.qrImageUrl}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          upiSettings: { ...siteSettings.upiSettings, qrImageUrl: e.target.value }
                        })}
                        className="w-full h-10 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-gray-600 font-mono text-[11px] focus:border-[#d97706] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                        UPI QR Code Scan Instruction Note
                      </label>
                      <input
                        type="text"
                        placeholder="Scan with GPay, PhonePe, Paytm, BHIM or any UPI app"
                        value={siteSettings.upiSettings.qrNotes}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          upiSettings: { ...siteSettings.upiSettings, qrNotes: e.target.value }
                        })}
                        className="w-full h-10 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-gray-800 text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* QR Code Live Preview Card (1 Col) */}
                  <div className="bg-[#fefcf6] p-5 rounded-3xl border border-[#fde68a] space-y-3 text-center">
                    <span className="font-extrabold text-[10px] text-[#b45309] uppercase tracking-wider block">Live Payment QR Preview</span>
                    
                    <div className="w-44 h-44 mx-auto bg-white p-2 border-2 border-[#d97706]/40 rounded-2xl shadow-md flex items-center justify-center overflow-hidden relative">
                      {siteSettings.upiSettings.qrImageUrl ? (
                        <img src={siteSettings.upiSettings.qrImageUrl} alt="UPI QR Code Preview" className="w-full h-full object-contain" />
                      ) : (
                        <QrCode className="w-32 h-32 text-gray-400" />
                      )}
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="font-serif font-bold text-sm text-[#0f172a] block">{siteSettings.upiSettings.payeeName || 'KangleiAstro Services'}</span>
                      <span className="font-mono font-bold text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200 block truncate">
                        {siteSettings.upiSettings.upiId || 'kangleiastro@upi'}
                      </span>
                      <span className="text-[10px] text-gray-500 block pt-1">{siteSettings.upiSettings.qrNotes}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#fde68a]">
                  <button
                    type="button"
                    onClick={handleSaveSiteSettings}
                    disabled={savingSettings}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingSettings ? 'Saving Live Settings...' : 'Save Header & UPI QR Settings Live →'}</span>
                  </button>
                </div>
              </div>

              {/* ADMIN MASTER PASSWORD UPDATE BOX */}
              <div className="bg-white p-6 rounded-3xl border border-[#fde68a] space-y-4 text-xs text-[#0f172a] shadow-md">
                <div className="flex items-center justify-between border-b border-[#fde68a] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#d97706] text-white flex items-center justify-center font-bold">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#b45309]">Admin Security & Master Password</h4>
                      <p className="text-xs text-gray-500">Update the master password required to access the /admin panel</p>
                    </div>
                  </div>
                </div>

                {adminPwdMsg && (
                  <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-300 font-bold">
                    {adminPwdMsg}
                  </div>
                )}

                <form onSubmit={handleUpdateAdminMasterPassword} className="space-y-4 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                        Current Master Password *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Enter current password"
                        value={adminPasswordInput}
                        onChange={(e) => setAdminPasswordInput(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-amber-300 font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                        New Master Password *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Enter new master password"
                        value={adminNewPasswordInput}
                        onChange={(e) => setAdminNewPasswordInput(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-amber-300 font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 cursor-pointer"
                  >
                    Update Admin Master Password →
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB: 970x90 BANNER AD CMS */}
          {activeTab === 'banner' && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-2xl border border-[#f3e8d2] shadow-sm">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a]">970 x 90 Leaderboard Ad Space CMS</h3>
                  <p className="text-xs text-gray-500">Control website-wide header banner image, title, short description, button text, & target link live</p>
                </div>
                <button
                  onClick={handleSaveBannerAd}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Banner Ad Live</span>
                </button>
              </div>

              {/* LIVE AD PREVIEW CARD */}
              <div className="bg-white p-6 rounded-3xl border border-[#fde68a] space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#b45309] uppercase tracking-wider flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-[#d97706]" />
                    <span>Real-Time Visitor Preview (970 x 90 px Standard Leaderboard Format)</span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${bannerAd.active ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                    {bannerAd.active ? 'ACTIVE & VISIBLE ON SITE' : 'HIDDEN / DISABLED'}
                  </span>
                </div>

                {/* Interactive Simulated Preview Box */}
                <div className="w-full bg-[#fefcf6] p-4 rounded-2xl border border-[#fde68a] flex items-center justify-center">
                  <div className="w-full max-w-[970px] min-h-[90px] rounded-2xl bg-gradient-to-r from-[#fef3c7] via-[#fde68a] to-[#fef3c7] border-2 border-[#d97706] shadow-md p-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 relative overflow-hidden text-[#0f172a]">
                    <div className="flex items-center gap-3.5 z-10 overflow-hidden">
                      {bannerAd.imageUrl ? (
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#d97706]/40 bg-white">
                          <img src={bannerAd.imageUrl} alt="Ad Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-white border border-[#d97706] text-[#b45309] flex items-center justify-center shrink-0">
                          <Sparkles className="w-6 h-6" />
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#d97706] text-white font-black text-[9px] uppercase">ADVERTISEMENT</span>
                          <h4 className="font-serif font-bold text-[#0f172a] text-base truncate">{bannerAd.title || 'Ad Title Here'}</h4>
                        </div>
                        <p className="text-xs text-gray-700 line-clamp-1">{bannerAd.description || 'Short Description copy...'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 z-10">
                      <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md">
                        {bannerAd.buttonText || 'Button Text'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* EDIT FORM FIELDS */}
              <form onSubmit={handleSaveBannerAd} className="bg-white p-6 rounded-3xl border border-[#fde68a] space-y-4 text-xs text-[#0f172a] shadow-md">
                <div className="flex items-center justify-between border-b border-[#fde68a] pb-3">
                  <h4 className="font-serif font-bold text-lg text-[#b45309]">Ad Banner Content & Target Configuration</h4>
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-[#fefcf6] px-4 py-2 rounded-xl border border-[#fde68a]">
                    <input
                      type="checkbox"
                      checked={bannerAd.active}
                      onChange={(e) => setBannerAd({ ...bannerAd, active: e.target.checked })}
                      className="rounded text-[#d97706]"
                    />
                    <span className="text-xs text-[#b45309] font-extrabold">Enable 970x90 Banner Ad on Website</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  {/* Title */}
                  <div className="sm:col-span-8">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                      Ad Headline Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Special Manipuri Astrological Offer"
                      value={bannerAd.title}
                      onChange={(e) => setBannerAd({ ...bannerAd, title: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  {/* Theme Selector */}
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Banner Color Theme
                    </label>
                    <select
                      value={bannerAd.theme}
                      onChange={(e) => setBannerAd({ ...bannerAd, theme: e.target.value as any })}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-[#fbbf24] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                    >
                      <option value="gold">Vedic Gold & Midnight (Default)</option>
                      <option value="crimson">Crimson Festival Red</option>
                      <option value="emerald">Royal Emerald Green</option>
                      <option value="midnight">Sky Midnight Blue</option>
                    </select>
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                    Short Description Copy (Displayed in Banner) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Get 20% OFF Kuthi Matching & Full 36-Gun Ashtakoot Compatibility Reports today!"
                    value={bannerAd.description}
                    onChange={(e) => setBannerAd({ ...bannerAd, description: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-gray-200 text-xs focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                    Ad Image / Icon Thumbnail URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or /sample_image.jpg"
                    value={bannerAd.imageUrl}
                    onChange={(e) => setBannerAd({ ...bannerAd, imageUrl: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-sky-300 font-mono text-xs focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                {/* Button Text & Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Button CTA Label Text *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Claim 20% Discount →"
                      value={bannerAd.buttonText}
                      onChange={(e) => setBannerAd({ ...bannerAd, buttonText: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Button Target Link / URL *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. /matching, /kundli, or https://wa.me/..."
                      value={bannerAd.buttonLink}
                      onChange={(e) => setBannerAd({ ...bannerAd, buttonLink: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-sky-300 font-mono text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#3a506b]">
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Banner Ad & Publish Live Across Site</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 9: LIVE ACTIVITY TICKER CMS & SPEED CONTROL */}
          {activeTab === 'ticker' && (
            <div className="space-y-6">
              
              {/* Header Card */}
              <div className="bg-white p-6 rounded-3xl border border-[#fde68a] flex flex-wrap justify-between items-center gap-4 shadow-md">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a] flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#d97706]" />
                    <span>Live Activity Marquee Ticker CMS</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Control horizontal marquee scrolling speed, customize Manipur client activities, & manage live homepage notifications
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const updated = { ...tickerSettings, active: !tickerSettings.active };
                      setTickerSettings(updated);
                      handleSaveTickerSettings(updated);
                    }}
                    className={`px-4 py-2 rounded-xl font-extrabold text-xs border transition-all cursor-pointer ${
                      tickerSettings.active
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}
                  >
                    {tickerSettings.active ? '🟢 Ticker Enabled (Live)' : '⚪ Ticker Disabled'}
                  </button>

                  <button
                    onClick={() => handleSaveTickerSettings()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Ticker Settings</span>
                  </button>
                </div>
              </div>

              {/* 1. MARQUEE SPEED CONTROL & PRESETS */}
              <div className="bg-white p-6 rounded-3xl border border-[#fde68a] space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-[#fde68a] pb-3">
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#b45309]">Marquee Scrolling Speed Control</h4>
                    <p className="text-xs text-gray-500">Higher duration in seconds = slower & smoother text scrolling speed</p>
                  </div>
                  <span className="font-mono font-extrabold text-base text-[#b45309] bg-[#fef3c7] px-4 py-1.5 rounded-xl border border-[#fde68a]">
                    {tickerSettings.speedSeconds} seconds / loop
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Preset Speed Buttons */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#b45309]">
                      Quick Speed Presets
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: '⚡ Fast (35s)', val: 35 },
                        { label: '⚖️ Normal (65s)', val: 65 },
                        { label: '🐢 Slow (90s)', val: 90 },
                        { label: '🐌 Ultra Slow (120s)', val: 120 },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => {
                            const updated = { ...tickerSettings, speedSeconds: preset.val };
                            setTickerSettings(updated);
                            handleSaveTickerSettings(updated);
                          }}
                          className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                            tickerSettings.speedSeconds === preset.val
                              ? 'bg-[#d97706] border-[#f59e0b] text-white shadow-md'
                              : 'bg-[#0b132b] border-[#3a506b] text-gray-300 hover:border-[#d97706]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Seconds Input & Slider */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#e0a96d]">
                      Custom Duration Slider (15s – 180s)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={15}
                        max={180}
                        step={5}
                        value={tickerSettings.speedSeconds}
                        onChange={(e) => setTickerSettings({ ...tickerSettings, speedSeconds: Number(e.target.value) })}
                        className="flex-1 accent-[#d97706] cursor-pointer"
                      />
                      <input
                        type="number"
                        min={15}
                        max={300}
                        value={tickerSettings.speedSeconds}
                        onChange={(e) => setTickerSettings({ ...tickerSettings, speedSeconds: Number(e.target.value) })}
                        className="w-20 p-2 rounded-xl bg-[#0b132b] border border-[#3a506b] text-amber-300 font-mono font-bold text-center text-xs"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400">
                      💡 Tip: Setting <strong>65s - 90s</strong> gives clients plenty of time to read Manipur activity items comfortably.
                    </p>
                  </div>
                </div>

                {/* Live Real-time Speed Preview Box */}
                <div className="mt-4 pt-4 border-t border-[#3a506b]/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#fbbf24] block mb-2">
                    Live Real-Time Marquee Speed Preview
                  </span>
                  <div className="w-full overflow-hidden bg-[#fef3c7] border border-[#fde68a] py-2 px-3 rounded-xl">
                    <div
                      className="animate-marquee whitespace-nowrap gap-8 flex items-center"
                      style={{ animationDuration: `${tickerSettings.speedSeconds || 65}s` }}
                    >
                      {tickerSettings.items.map((act, idx) => (
                        <span key={act.id || idx} className="inline-flex items-center gap-2 text-xs font-semibold text-[#78350f] shrink-0">
                          <span className="text-[#d97706] font-bold">✦</span>
                          <strong className="font-extrabold text-[#0f172a]">{act.name}</strong> from <span className="font-bold text-[#b45309]">{act.place}</span> {act.action}
                          <span className="text-[10px] text-[#b45309]/80 font-mono">({act.time})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. ADD NEW MANIPUR TICKER ENTRY FORM */}
              <div className="bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] space-y-4">
                <h4 className="font-serif font-bold text-lg text-[#fbbf24] flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#d97706]" />
                  Add New Live Activity Ticker Item
                </h4>

                <form onSubmit={handleAddTickerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sanatombi / Tomba"
                      value={newTickerForm.name}
                      onChange={(e) => setNewTickerForm({ ...newTickerForm, name: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-semibold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Manipur Location / Town *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Imphal West, Thoubal, Kakching"
                      value={newTickerForm.place}
                      onChange={(e) => setNewTickerForm({ ...newTickerForm, place: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-semibold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Activity / Action Description *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. booked Kuthi Matching report with Pt. Ningthem"
                      value={newTickerForm.action}
                      onChange={(e) => setNewTickerForm({ ...newTickerForm, action: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                        Time Tag *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2 min ago, just now"
                        value={newTickerForm.time}
                        onChange={(e) => setNewTickerForm({ ...newTickerForm, time: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-[#fbbf24] font-mono text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="h-11 px-5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 shrink-0 flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Entry</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* 3. MANAGE & DELETE EXISTING TICKER ITEMS TABLE */}
              <div className="bg-[#1c2541] rounded-3xl border border-[#3a506b] shadow-xl overflow-hidden">
                <div className="p-6 border-b border-[#3a506b] flex justify-between items-center">
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#fbbf24]">Current Live Ticker Items ({tickerSettings.items.length})</h4>
                    <p className="text-xs text-gray-400">Items scroll sequentially across the homepage marquee ribbon</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0b132b] border-b border-[#3a506b] text-[#fbbf24] font-serif uppercase tracking-wider">
                        <th className="p-4">#</th>
                        <th className="p-4">Client Name</th>
                        <th className="p-4">Manipur Location</th>
                        <th className="p-4">Action / Event Details</th>
                        <th className="p-4">Time Tag</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3a506b]/50">
                      {tickerSettings.items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-[#0b132b]/40 transition-colors">
                          <td className="p-4 font-mono font-bold text-[#fbbf24]">{idx + 1}</td>
                          <td className="p-4 font-extrabold text-white">{item.name}</td>
                          <td className="p-4 text-amber-300 font-bold">{item.place}</td>
                          <td className="p-4 text-gray-200">{item.action}</td>
                          <td className="p-4 font-mono text-gray-400">{item.time}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteTickerItem(item.id)}
                              className="p-2 rounded-xl bg-red-900/30 text-red-300 hover:bg-red-900/50 border border-red-500/40 transition-colors"
                              title="Delete Ticker Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 10: CLIENT REVIEWS MODERATION & CMS HUB */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Header Card */}
              <div className="bg-white p-6 rounded-3xl border border-[#fde68a] flex flex-wrap justify-between items-center gap-4 shadow-md">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-extrabold uppercase mb-2 border border-[#fde68a]">
                    <Star className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                    Customer Reviews Moderation Hub
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a]">
                    Client Reviews & Testimonials CMS
                  </h3>
                  <p className="text-xs text-gray-500">
                    Approve, edit, or delete customer reviews. Approved reviews are displayed live on the homepage testimonials carousel.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddReviewModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Verified Review</span>
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#fde68a] space-y-1 shadow-xs">
                  <span className="text-xs text-gray-500 font-bold block uppercase">Total Reviews</span>
                  <span className="text-2xl font-serif font-extrabold text-[#b45309]">{reviews.length}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-green-300 space-y-1 shadow-xs">
                  <span className="text-xs text-green-700 font-bold block uppercase">Approved (Live)</span>
                  <span className="text-2xl font-serif font-extrabold text-green-700">
                    {reviews.filter((r) => r.status === 'APPROVED').length}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-amber-300 space-y-1 shadow-xs">
                  <span className="text-xs text-amber-800 font-bold block uppercase">Pending Moderation</span>
                  <span className="text-2xl font-serif font-extrabold text-[#b45309]">
                    {reviews.filter((r) => r.status === 'PENDING').length}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-purple-300 space-y-1 shadow-xs">
                  <span className="text-xs text-purple-700 font-bold block uppercase">Average Rating</span>
                  <span className="text-2xl font-serif font-extrabold text-purple-700 flex items-center gap-1">
                    5.0 <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </span>
                </div>
              </div>

              {/* Reviews List Table */}
              <div className="bg-white rounded-3xl border border-[#fde68a] overflow-hidden shadow-xl">
                <div className="p-5 border-b border-[#fde68a] bg-[#fefcf6] flex justify-between items-center">
                  <h4 className="font-serif font-bold text-lg text-[#b45309]">Submitted Client Reviews</h4>
                  <span className="text-xs text-gray-500">Click Approve to publish live on homepage</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans text-[#0f172a]">
                    <thead className="bg-[#fef3c7] text-[#78350f] uppercase tracking-wider font-extrabold border-b border-[#fde68a]">
                      <tr>
                        <th className="p-4">Client & Location</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Review Comment</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#fde68a]">
                      {reviews.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
                            No reviews submitted yet.
                          </td>
                        </tr>
                      ) : (
                        reviews.map((r) => (
                          <tr key={r.id} className="hover:bg-[#fefcf6] transition-colors">
                            <td className="p-4">
                              <div className="font-extrabold text-[#0f172a] text-sm">{r.clientName}</div>
                              <div className="text-gray-500 text-[11px]">{r.location}</div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                {[...Array(r.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            </td>
                            <td className="p-4 font-bold text-[#b45309]">{r.serviceName || 'Consultation'}</td>
                            <td className="p-4 text-gray-700 max-w-xs font-medium leading-relaxed">{r.comment}</td>
                            <td className="p-4">
                              {r.status === 'APPROVED' && (
                                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                                  🟢 APPROVED
                                </span>
                              )}
                              {r.status === 'PENDING' && (
                                <span className="px-3 py-1 rounded-full bg-amber-100 text-[#78350f] text-[10px] font-extrabold border border-amber-300 animate-pulse">
                                  ⏳ PENDING APPROVAL
                                </span>
                              )}
                              {r.status === 'REJECTED' && (
                                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold border border-rose-300">
                                  🔴 REJECTED
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {r.status !== 'APPROVED' && (
                                  <button
                                    onClick={() => handleApproveReview(r.id)}
                                    className="p-2 rounded-xl bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/60 border border-emerald-500/40 transition-colors cursor-pointer"
                                    title="Approve & Publish Live"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                {r.status !== 'REJECTED' && (
                                  <button
                                    onClick={() => handleRejectReview(r.id)}
                                    className="p-2 rounded-xl bg-amber-900/40 text-amber-300 hover:bg-amber-800/60 border border-amber-500/40 transition-colors cursor-pointer"
                                    title="Reject Review"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => setEditingReview(r)}
                                  className="p-2 rounded-xl bg-blue-900/40 text-blue-300 hover:bg-blue-800/60 border border-blue-500/40 transition-colors cursor-pointer"
                                  title="Edit Review Details"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(r.id)}
                                  className="p-2 rounded-xl bg-rose-900/40 text-rose-300 hover:bg-rose-800/60 border border-rose-500/40 transition-colors cursor-pointer"
                                  title="Delete Review"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: NAVBAR NAVIGATION MENU CONTROLLER */}
          {activeTab === 'navbar' && (
            <div className="space-y-6 text-[#0f172a] font-sans">
              {/* TOP HEADER BAR */}
              <div className="bg-white p-6 rounded-3xl border border-[#fde68a] shadow-md flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white flex items-center justify-center font-bold shadow-md">
                    <Menu className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#b45309]">
                      Navbar Navigation Menu Controller
                    </h3>
                    <p className="text-xs text-gray-500">
                      Add, edit, remove & re-order top menu items, dropdown sub-menus, and call-to-action header buttons
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddNavItem}
                    className="px-4 py-2.5 rounded-xl bg-amber-100 text-[#b45309] font-extrabold text-xs hover:bg-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer border border-amber-300"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Top Menu Item</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveNavConfig}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Publish Navbar Live</span>
                  </button>
                </div>
              </div>

              {/* ACTIVE TOP MENU ITEMS CARDS */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h4 className="font-serif font-bold text-lg text-[#0f172a] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#d97706]" />
                    Top-Level Navigation Menu Links ({navConfig.items?.length || 0})
                  </h4>
                </div>

                {navConfig.items?.map((item: any, index: number) => (
                  <div
                    key={item.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      item.active !== false
                        ? 'bg-white border-[#fde68a] shadow-sm'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#fde68a]/50 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#fef3c7] text-[#b45309] font-black text-xs flex items-center justify-center border border-[#fde68a]">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNavConfig((prev: any) => ({
                              ...prev,
                              items: prev.items.map((it: any) => (it.id === item.id ? { ...it, title: val } : it)),
                            }));
                          }}
                          placeholder="Menu Item Title"
                          className="font-serif font-bold text-base text-[#0f172a] bg-[#fefcf6] px-3 py-1 rounded-xl border border-gray-300 focus:border-[#d97706] focus:outline-none"
                        />
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          item.type === 'dropdown'
                            ? 'bg-amber-100 text-[#b45309] border-amber-300'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {item.type === 'dropdown' ? 'Dropdown Menu' : 'Flat Link'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Move Up/Down */}
                        <button
                          type="button"
                          onClick={() => handleMoveNavItem(item.id, 'up')}
                          disabled={index === 0}
                          className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold disabled:opacity-30 cursor-pointer"
                        >
                          ↑ Up
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveNavItem(item.id, 'down')}
                          disabled={index === (navConfig.items.length - 1)}
                          className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold disabled:opacity-30 cursor-pointer"
                        >
                          ↓ Down
                        </button>

                        {/* Active Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleNavItem(item.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer border ${
                            item.active !== false
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-gray-200 text-gray-600 border-gray-300'
                          }`}
                        >
                          {item.active !== false ? 'Active (Visible)' : 'Hidden'}
                        </button>

                        {/* Delete Menu Item */}
                        <button
                          type="button"
                          onClick={() => handleRemoveNavItem(item.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 cursor-pointer"
                          title="Delete Menu Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-[#b45309] uppercase mb-1">
                          Menu Type (Link vs Dropdown)
                        </label>
                        <select
                          value={item.type}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setNavConfig((prev: any) => ({
                              ...prev,
                              items: prev.items.map((it: any) => (it.id === item.id ? { ...it, type: val, subItems: val === 'dropdown' ? (it.subItems || []) : it.subItems } : it)),
                            }));
                          }}
                          className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-bold text-[#0f172a] focus:border-[#d97706] focus:outline-none"
                        >
                          <option value="link">Direct Link (Navigates to URL)</option>
                          <option value="dropdown">Dropdown Sub-Menu (Shows child links)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#b45309] uppercase mb-1">
                          Target URL Path / Link
                        </label>
                        <input
                          type="text"
                          value={item.href}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNavConfig((prev: any) => ({
                              ...prev,
                              items: prev.items.map((it: any) => (it.id === item.id ? { ...it, href: val } : it)),
                            }));
                          }}
                          placeholder="e.g. /services or /horoscope"
                          className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-mono font-bold text-blue-700 focus:border-[#d97706] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#b45309] uppercase mb-1">
                          Badge Tag (Optional)
                        </label>
                        <input
                          type="text"
                          value={item.badge || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNavConfig((prev: any) => ({
                              ...prev,
                              items: prev.items.map((it: any) => (it.id === item.id ? { ...it, badge: val } : it)),
                            }));
                          }}
                          placeholder="e.g. HOT, FREE, NEW"
                          className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-bold text-amber-700 uppercase focus:border-[#d97706] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* DROPDOWN SUB-ITEMS SECTION */}
                    {item.type === 'dropdown' && (
                      <div className="mt-4 p-4 rounded-2xl bg-[#fef3c7]/40 border border-[#fde68a] space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-[#fde68a]">
                          <span className="text-xs font-bold text-[#78350f] uppercase tracking-wider">
                            Dropdown Child Sub-Menu Links ({item.subItems?.length || 0})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddSubItem(item.id)}
                            className="px-3 py-1 rounded-lg bg-amber-600 text-white font-extrabold text-[11px] hover:bg-amber-700 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Add Sub-Menu Link</span>
                          </button>
                        </div>

                        {(!item.subItems || item.subItems.length === 0) ? (
                          <div className="text-xs text-gray-500 italic text-center py-2">
                            No child links in this dropdown yet. Click "+ Add Sub-Menu Link" above!
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {item.subItems.map((sub: any) => (
                              <div
                                key={sub.id}
                                className="p-3 rounded-xl bg-white border border-[#fde68a] grid grid-cols-1 sm:grid-cols-4 gap-2 items-center text-xs"
                              >
                                <div>
                                  <label className="block text-[9px] font-bold text-gray-500 uppercase">Sub-Title</label>
                                  <input
                                    type="text"
                                    value={sub.title}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setNavConfig((prev: any) => ({
                                        ...prev,
                                        items: prev.items.map((it: any) =>
                                          it.id === item.id
                                            ? {
                                                ...it,
                                                subItems: it.subItems?.map((s: any) => (s.id === sub.id ? { ...s, title: val } : s)),
                                              }
                                            : it
                                        ),
                                      }));
                                    }}
                                    placeholder="Child Title"
                                    className="w-full h-8 px-2 rounded-lg border border-gray-300 bg-[#fefcf6] font-bold text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[9px] font-bold text-gray-500 uppercase">URL Link</label>
                                  <input
                                    type="text"
                                    value={sub.href}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setNavConfig((prev: any) => ({
                                        ...prev,
                                        items: prev.items.map((it: any) =>
                                          it.id === item.id
                                            ? {
                                                ...it,
                                                subItems: it.subItems?.map((s: any) => (s.id === sub.id ? { ...s, href: val } : s)),
                                              }
                                            : it
                                        ),
                                      }));
                                    }}
                                    placeholder="/manipuri_kuthi_yengba"
                                    className="w-full h-8 px-2 rounded-lg border border-gray-300 bg-[#fefcf6] font-mono text-blue-700 text-[11px]"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[9px] font-bold text-gray-500 uppercase">Description</label>
                                  <input
                                    type="text"
                                    value={sub.description || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setNavConfig((prev: any) => ({
                                        ...prev,
                                        items: prev.items.map((it: any) =>
                                          it.id === item.id
                                            ? {
                                                ...it,
                                                subItems: it.subItems?.map((s: any) => (s.id === sub.id ? { ...s, description: val } : s)),
                                              }
                                            : it
                                        ),
                                      }));
                                    }}
                                    placeholder="Sub-text description"
                                    className="w-full h-8 px-2 rounded-lg border border-gray-300 bg-[#fefcf6] text-gray-600 text-[11px]"
                                  />
                                </div>

                                <div className="flex items-center gap-2 justify-end pt-3 sm:pt-0">
                                  <input
                                    type="text"
                                    value={sub.badge || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setNavConfig((prev: any) => ({
                                        ...prev,
                                        items: prev.items.map((it: any) =>
                                          it.id === item.id
                                            ? {
                                                ...it,
                                                subItems: it.subItems?.map((s: any) => (s.id === sub.id ? { ...s, badge: val } : s)),
                                              }
                                            : it
                                        ),
                                      }));
                                    }}
                                    placeholder="Badge"
                                    className="w-20 h-8 px-2 rounded-lg border border-gray-300 bg-[#fefcf6] text-amber-700 text-[10px] font-bold uppercase text-center"
                                  />

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSubItem(item.id, sub.id)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                                    title="Remove Sub Item"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* HEADER ACTION BUTTONS CONTROLLER CARD */}
              <div className="bg-white p-6 rounded-3xl border border-[#fde68a] shadow-md space-y-4 text-[#0f172a]">
                <h4 className="font-serif font-bold text-lg text-[#b45309] flex items-center gap-2 border-b border-[#fde68a] pb-3">
                  <Sun className="w-5 h-5 text-[#d97706]" />
                  Header CTA Action Buttons (Top Right Desktop Buttons)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Button 1: Numit Leppa */}
                  <div className="p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a] space-y-2">
                    <label className="flex items-center justify-between font-bold text-[#0f172a]">
                      <span>Numit Leppa Button</span>
                      <input
                        type="checkbox"
                        checked={navConfig.cbs?.showNumitLeppaBtn !== false}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setNavConfig((prev: any) => ({ ...prev, cbs: { ...prev.cbs, showNumitLeppaBtn: val } }));
                        }}
                        className="rounded text-[#d97706] w-4 h-4 cursor-pointer"
                      />
                    </label>
                    <input
                      type="text"
                      value={navConfig.cbs?.numitLeppaBtnText || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNavConfig((prev: any) => ({ ...prev, cbs: { ...prev.cbs, numitLeppaBtnText: val } }));
                      }}
                      placeholder="Button Label"
                      className="w-full h-9 px-2.5 rounded-lg border border-gray-300 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={navConfig.cbs?.numitLeppaBtnHref || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNavConfig((prev: any) => ({ ...prev, cbs: { ...prev.cbs, numitLeppaBtnHref: val } }));
                      }}
                      placeholder="Target Link"
                      className="w-full h-9 px-2.5 rounded-lg border border-gray-300 font-mono text-blue-700 text-xs"
                    />
                  </div>

                  {/* Button 2: Kuthi Yengba */}
                  <div className="p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a] space-y-2">
                    <label className="flex items-center justify-between font-bold text-[#0f172a]">
                      <span>Kuthi Yengba Button</span>
                      <input
                        type="checkbox"
                        checked={navConfig.cbs?.showKuthiYengbaBtn !== false}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setNavConfig((prev: any) => ({ ...prev, cbs: { ...prev.cbs, showKuthiYengbaBtn: val } }));
                        }}
                        className="rounded text-[#d97706] w-4 h-4 cursor-pointer"
                      />
                    </label>
                    <input
                      type="text"
                      value={navConfig.cbs?.kuthiYengbaBtnText || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNavConfig((prev: any) => ({ ...prev, cbs: { ...prev.cbs, kuthiYengbaBtnText: val } }));
                      }}
                      placeholder="Button Label"
                      className="w-full h-9 px-2.5 rounded-lg border border-gray-300 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={navConfig.cbs?.kuthiYengbaBtnHref || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNavConfig((prev: any) => ({ ...prev, cbs: { ...prev.cbs, kuthiYengbaBtnHref: val } }));
                      }}
                      placeholder="Target Link"
                      className="w-full h-9 px-2.5 rounded-lg border border-gray-300 font-mono text-blue-700 text-xs"
                    />
                  </div>

                  {/* Button 3: Kuthi Iba */}
                  <div className="p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a] space-y-2">
                    <label className="flex items-center justify-between font-bold text-[#0f172a]">
                      <span>Kuthi Iba Button</span>
                      <input
                        type="checkbox"
                        checked={navConfig.cbs?.showKuthiIbaBtn !== false}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setNavConfig((prev: any) => ({ ...prev, cbs: { ...prev.cbs, showKuthiIbaBtn: val } }));
                        }}
                        className="rounded text-[#d97706] w-4 h-4 cursor-pointer"
                      />
                    </label>
                    <input
                      type="text"
                      value={navConfig.cbs?.kuthiIbaBtnText || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNavConfig((prev: any) => ({ ...prev, cbs: { ...prev.cbs, kuthiIbaBtnText: val } }));
                      }}
                      placeholder="Button Label"
                      className="w-full h-9 px-2.5 rounded-lg border border-gray-300 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={navConfig.cbs?.kuthiIbaBtnHref || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNavConfig((prev: any) => ({ ...prev, cbs: { ...prev.cbs, kuthiIbaBtnHref: val } }));
                      }}
                      placeholder="Target Link"
                      className="w-full h-9 px-2.5 rounded-lg border border-gray-300 font-mono text-blue-700 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveNavConfig}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Publish Navbar Live</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
         3. KUTHI DOCUMENT INSPECTION & DOWNLOAD MODAL
         ───────────────────────────────────────────────────────────── */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-[#fde68a] shadow-2xl overflow-hidden relative text-left font-sans text-[#0f172a]">
            
            {/* Modal Header */}
            <div className="p-6 bg-[#fef3c7] text-[#0f172a] flex items-center justify-between border-b border-[#fde68a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d97706] text-white flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#b45309]">Kuthi Document & Client Profile</h3>
                  <p className="text-xs text-gray-500 font-mono">Ref ID: {inspectingOrder.orderRef}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Document Preview Box & Download Trigger */}
              <div className="p-5 rounded-2xl bg-[#fefcf6] border border-[#fde68a] text-[#0f172a] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-xs text-[#b45309] uppercase tracking-wider block">Attached Kuthi File</span>
                  <strong className="text-sm text-[#0f172a] block mt-0.5">
                    {inspectingOrder.kuthiAttached ? inspectingOrder.kuthiFileName : 'No Physical Paper Uploaded (Use Birth Details Below)'}
                  </strong>
                </div>

                {inspectingOrder.kuthiAttached ? (
                  <a
                    href={inspectingOrder.kuthiFileUrl || '#'}
                    download
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-bold text-xs flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Kuthi File</span>
                  </a>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-[#78350f] font-bold text-xs border border-amber-300">
                    Birth Details Mode
                  </span>
                )}
              </div>

              {/* Complete Client / Couple Details Table */}
              <div className="bg-[#fefcf6] p-5 rounded-2xl border border-[#fde68a] space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-[#fde68a] pb-3">
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase font-bold block">Client / Couple Name</span>
                    <strong className="text-[#0f172a] text-base">{inspectingOrder.clientName} ({inspectingOrder.sex})</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 text-[10px] uppercase font-bold block">WhatsApp Contact</span>
                    <strong className="text-[#b45309] text-sm font-mono">{inspectingOrder.whatsappNo}</strong>
                  </div>
                </div>

                {/* Check if it's a Couple / Kuthi Matching Order with Groom & Bride formatted details */}
                {inspectingOrder.dob && inspectingOrder.dob.includes('Groom:') ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Groom Column */}
                    <div className="p-4 rounded-xl bg-white border border-blue-200 space-y-2 shadow-xs">
                      <span className="font-bold text-blue-700 text-xs flex items-center gap-1.5 border-b border-blue-200 pb-1.5">
                        👦 Groom Birth Details
                      </span>
                      <div className="space-y-1 text-gray-700">
                        <div><span className="text-gray-500 text-[10px]">DOB:</span> <strong className="text-[#0f172a]">{inspectingOrder.dob.split('|')[0]?.replace('Groom:', '').trim()}</strong></div>
                        <div><span className="text-gray-500 text-[10px]">TOB:</span> <strong className="text-[#0f172a]">{inspectingOrder.tob?.split('|')[0]?.replace('Groom:', '').trim()}</strong></div>
                        <div><span className="text-gray-500 text-[10px]">POB:</span> <strong className="text-[#0f172a]">{inspectingOrder.pob?.split('|')[0]?.replace('Groom:', '').trim()}</strong></div>
                      </div>
                    </div>

                    {/* Bride Column */}
                    <div className="p-4 rounded-xl bg-white border border-pink-200 space-y-2 shadow-xs">
                      <span className="font-bold text-pink-700 text-xs flex items-center gap-1.5 border-b border-pink-200 pb-1.5">
                        👧 Bride Birth Details
                      </span>
                      <div className="space-y-1 text-gray-700">
                        <div><span className="text-gray-500 text-[10px]">DOB:</span> <strong className="text-[#0f172a]">{inspectingOrder.dob.split('|')[1]?.replace('Bride:', '').trim()}</strong></div>
                        <div><span className="text-gray-500 text-[10px]">TOB:</span> <strong className="text-[#0f172a]">{inspectingOrder.tob?.split('|')[1]?.replace('Bride:', '').trim()}</strong></div>
                        <div><span className="text-gray-500 text-[10px]">POB:</span> <strong className="text-[#0f172a]">{inspectingOrder.pob?.split('|')[1]?.replace('Bride:', '').trim()}</strong></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Single Client / Kuthi Iba Order */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 bg-white p-4 rounded-xl border border-[#fde68a]">
                    {inspectingOrder.fatherName && (
                      <div>
                        <span className="text-[#b45309] text-[10px] uppercase font-extrabold block">Father's Name (পিতাগী মমিং)</span>
                        <strong className="text-[#0f172a] text-sm">{inspectingOrder.fatherName}</strong>
                      </div>
                    )}
                    {inspectingOrder.motherName && (
                      <div>
                        <span className="text-[#b45309] text-[10px] uppercase font-extrabold block">Mother's Name (ইমাগী মমিং)</span>
                        <strong className="text-[#0f172a] text-sm">{inspectingOrder.motherName}</strong>
                      </div>
                    )}
                    {inspectingOrder.yek && (
                      <div>
                        <span className="text-[#b45309] text-[10px] uppercase font-extrabold block">Yek / Salai</span>
                        <strong className="text-[#0f172a] text-sm">{inspectingOrder.yek}</strong>
                      </div>
                    )}
                    {inspectingOrder.gotra && (
                      <div>
                        <span className="text-[#b45309] text-[10px] uppercase font-extrabold block">Gotra / Sagei</span>
                        <strong className="text-[#0f172a] text-sm">{inspectingOrder.gotra}</strong>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500 text-[10px] uppercase font-bold block">Date of Birth</span>
                      <strong className="text-[#0f172a]">{inspectingOrder.dob || 'See Kuthi Document'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] uppercase font-bold block">Time of Birth</span>
                      <strong className="text-[#0f172a]">{inspectingOrder.tob || 'See Kuthi Document'}</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-500 text-[10px] uppercase font-bold block">Place of Birth</span>
                      <strong className="text-[#0f172a]">{inspectingOrder.pob || 'See Kuthi Document'}</strong>
                    </div>
                    {inspectingOrder.deliveryAddress && (
                      <div className="sm:col-span-2 pt-2 border-t border-gray-200">
                        <span className="text-emerald-700 text-[10px] uppercase font-extrabold block">Physical Delivery Address (Hardcopy Shipment)</span>
                        <strong className="text-emerald-800 text-xs font-mono">{inspectingOrder.deliveryAddress}</strong>
                      </div>
                    )}
                  </div>
                )}

                {inspectingOrder.question && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-500 text-[10px] uppercase font-bold block">Analysis Question / Notes</span>
                    <p className="text-gray-800 font-mono text-[11px] mt-0.5">{inspectingOrder.question}</p>
                  </div>
                )}
              </div>

              {/* Astrologer Uploaded Report Box */}
              <div className="p-5 rounded-2xl bg-white border border-green-300 text-[#0f172a] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-green-700 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Astrologer Uploaded Report</span>
                  </span>
                  {inspectingOrder.reportUploadedAt && (
                    <span className="text-[10px] text-gray-500 font-mono">{inspectingOrder.reportUploadedAt}</span>
                  )}
                </div>

                {inspectingOrder.reportReceivedFromAstro || inspectingOrder.reportFileName ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fefcf6] p-3 rounded-xl border border-[#fde68a]">
                    <div>
                      <div className="font-bold text-[#0f172a] text-sm">{inspectingOrder.reportFileName || 'Astrological_Remedies_Report.pdf'}</div>
                      {inspectingOrder.reportUploadedBy && (
                        <div className="text-[11px] text-gray-600 mt-0.5">Uploaded by Guru: {inspectingOrder.reportUploadedBy}</div>
                      )}
                      {inspectingOrder.reportNotes && (
                        <div className="text-[11px] text-gray-700 italic mt-1 bg-white p-2 rounded-lg border border-gray-200">
                          &ldquo;{inspectingOrder.reportNotes}&rdquo;
                        </div>
                      )}
                    </div>
                    <a
                      href={inspectingOrder.reportFileUrl || '/sample_kuthi_report.pdf'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Report PDF</span>
                    </a>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic bg-[#fefcf6] p-3 rounded-xl border border-[#fde68a]">
                    ⏳ Report not yet uploaded by assigned astrologer. Astrologer can upload directly from their dashboard.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => handleCopyDetails(inspectingOrder)}
                  className="px-4 py-2.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#b45309] font-bold text-xs flex items-center gap-2 border border-[#fde68a] cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-[#d97706]" />
                  <span>{copiedText ? '✓ Details Copied!' : 'Copy Text Summary'}</span>
                </button>

                <button
                  onClick={() => setInspectingOrder(null)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-bold text-xs hover:opacity-95 cursor-pointer shadow-md"
                >
                  Close Document Viewer
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         4. ADD NEW SERVICE PACKAGE MODAL
         ───────────────────────────────────────────────────────────── */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateNewServicePackage}
            className="bg-white w-full max-w-xl rounded-3xl border border-[#fde68a] shadow-2xl overflow-hidden relative text-left font-sans text-[#0f172a] p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#fde68a] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#d97706] text-white flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#b45309]">Add New Service Package</h3>
                  <p className="text-xs text-gray-500">Create a new astrology consultation package name and pricing</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddServiceModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Service Package Name / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raj Yoga & Wealth Audit"
                  value={newServiceForm.title}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, title: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Tag Badge
                </label>
                <input
                  type="text"
                  placeholder="Popular / New"
                  value={newServiceForm.badge}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, badge: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-extrabold text-xs focus:border-[#d97706] focus:outline-none uppercase"
                />
              </div>
            </div>

            {/* Client Price & Astrologer Payout Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Client Price (₹) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="₹1,499"
                  value={newServiceForm.price}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, price: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-extrabold text-sm font-mono focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Astrologer Payout Fee (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="900"
                  value={newServiceForm.astroPayoutFee}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, astroPayoutFee: parseInt(e.target.value) || 0 })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-emerald-700 font-extrabold text-sm font-mono focus:border-[#d97706] focus:outline-none"
                />
              </div>
            </div>

            {/* Description / Highlights */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                Description / Highlights Copy *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Full birth chart analysis, gemstone recommendations..."
                value={newServiceForm.description}
                onChange={(e) => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] text-xs focus:border-[#d97706] focus:outline-none"
              />
            </div>

            {/* Button CTA Text & Target Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Button CTA Label Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Book Now"
                  value={newServiceForm.cta}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, cta: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Button Target Link / URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. /kundli or https://wa.me/..."
                  value={newServiceForm.link}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, link: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-blue-700 font-mono text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#fde68a]">
              <button
                type="button"
                onClick={() => setShowAddServiceModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#fef3c7] text-[#b45309] text-xs font-bold border border-[#fde68a] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 cursor-pointer"
              >
                + Publish Service Package Live →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT CUSTOMER REVIEW MODAL */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveReviewEdit}
            className="bg-white w-full max-w-xl rounded-3xl border border-[#fde68a] shadow-2xl overflow-hidden relative text-left font-sans text-[#0f172a] p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#fde68a] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#d97706] text-white flex items-center justify-center font-bold">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#b45309]">Edit Customer Review</h3>
                  <p className="text-xs text-gray-500">Modify review details, rating, or approval status</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingReview.clientName || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, clientName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Location / City *
                </label>
                <input
                  type="text"
                  required
                  value={editingReview.location || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, location: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Star Rating (1-5)
                </label>
                <select
                  value={editingReview.rating || 5}
                  onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                >
                  <option value={5}>5 Stars (★★★★★)</option>
                  <option value={4}>4 Stars (★★★★☆)</option>
                  <option value={3}>3 Stars (★★★☆☆)</option>
                  <option value={2}>2 Stars (★★☆☆☆)</option>
                  <option value={1}>1 Star (★☆☆☆☆)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Moderation Status
                </label>
                <select
                  value={editingReview.status || 'APPROVED'}
                  onChange={(e) => setEditingReview({ ...editingReview, status: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-emerald-700 font-bold text-xs focus:border-[#d97706] focus:outline-none"
                >
                  <option value="APPROVED">🟢 APPROVED (Live on Home)</option>
                  <option value="PENDING">⏳ PENDING APPROVAL</option>
                  <option value="REJECTED">🔴 REJECTED</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                Service Consulted
              </label>
              <input
                type="text"
                value={editingReview.serviceName || ''}
                onChange={(e) => setEditingReview({ ...editingReview, serviceName: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-amber-300 font-bold text-xs focus:border-[#d97706] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                Review Comment / Feedback Copy *
              </label>
              <textarea
                rows={4}
                required
                value={editingReview.comment || ''}
                onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                className="w-full p-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-gray-200 text-xs focus:border-[#d97706] focus:outline-none font-medium"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#3a506b]">
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="px-5 py-2.5 rounded-xl bg-[#0b132b] text-gray-300 text-xs font-bold border border-[#3a506b] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 cursor-pointer"
              >
                Save Review Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD NEW VERIFIED REVIEW MODAL (Admin Manual Add) */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-[#0b132b]/85 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateReviewAdmin}
            className="bg-[#1c2541] w-full max-w-xl rounded-3xl border border-[#3a506b] shadow-2xl overflow-hidden relative text-left font-sans text-white p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#3a506b] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#d97706] text-white flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#b45309]">Add Verified Client Review</h3>
                  <p className="text-xs text-gray-500">Manually post a verified customer testimonial</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddReviewModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tombi Meitei"
                  value={newReviewForm.clientName}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, clientName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Location / City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Imphal West, Manipur"
                  value={newReviewForm.location}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, location: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Star Rating (1-5)
                </label>
                <select
                  value={newReviewForm.rating}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                >
                  <option value={5}>5 Stars (★★★★★)</option>
                  <option value={4}>4 Stars (★★★★☆)</option>
                  <option value={3}>3 Stars (★★★☆☆)</option>
                  <option value={2}>2 Stars (★★☆☆☆)</option>
                  <option value={1}>1 Star (★☆☆☆☆)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Service Consulted
                </label>
                <select
                  value={newReviewForm.serviceName}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, serviceName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                >
                  <option value="Kuthi Yengba Consultation">Kuthi Yengba Consultation</option>
                  <option value="Kuthi Iba (কুঠি ইবা)">Kuthi Iba (কুঠি ইবা)</option>
                  <option value="Marriage Matching (পক্ন-ৱাইনবা য়েংবা)">Marriage Matching</option>
                  <option value="Career & Financial Outlook">Career & Financial Outlook</option>
                  <option value="30-Page Kuthi Report">30-Page Kuthi Report</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                Detailed Review / Testimonial Copy *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Enter client testimonial text..."
                value={newReviewForm.comment}
                onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] text-xs focus:border-[#d97706] focus:outline-none font-medium"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#fde68a]">
              <button
                type="button"
                onClick={() => setShowAddReviewModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#fef3c7] text-[#b45309] text-xs font-bold border border-[#fde68a] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 cursor-pointer"
              >
                + Publish Review Live →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MANAGE ASTROLOGER TOOL ACCESS PERMISSIONS MODAL */}
      {toolModalAstro && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-[#fde68a] shadow-2xl overflow-hidden relative text-left font-sans text-[#0f172a] p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#fde68a] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d97706] text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#b45309]">Astrologer Tool Access Control</h3>
                  <p className="text-xs text-gray-500">Grant or restrict specific calculators for {toolModalAstro.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setToolModalAstro(null)}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-between items-center bg-[#fefcf6] p-3 rounded-2xl border border-[#fde68a] text-xs">
              <span className="text-gray-700 font-bold">
                Selected: <strong className="text-[#b45309]">{selectedToolIds.length}</strong> / 19 Tools Allowed
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedToolIds(ALL_TOOL_ITEMS.map((t) => t.id))}
                  className="px-3 py-1 rounded-lg bg-[#fef3c7] hover:bg-[#fde68a] text-[#b45309] font-extrabold text-[11px] border border-[#fde68a] cursor-pointer"
                >
                  Select All 19
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedToolIds([])}
                  className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-[11px] border border-gray-300 cursor-pointer"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
              {ALL_TOOL_ITEMS.map((tool) => {
                const isChecked = selectedToolIds.includes(tool.id);
                return (
                  <label
                    key={tool.id}
                    onClick={() => {
                      if (isChecked) {
                        setSelectedToolIds(selectedToolIds.filter((id) => id !== tool.id));
                      } else {
                        setSelectedToolIds([...selectedToolIds, tool.id]);
                      }
                    }}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-[#fefcf6] border-[#d97706] text-[#0f172a]'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded text-[#d97706] focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold text-xs">{tool.title}</span>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#fde68a]">
              <button
                type="button"
                onClick={() => setToolModalAstro(null)}
                className="px-5 py-2.5 rounded-xl bg-[#fef3c7] text-[#b45309] text-xs font-bold border border-[#fde68a] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveToolPermissions}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 cursor-pointer"
              >
                Save Tool Access Permissions →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         MODAL: POST ANNOUNCEMENT / PROMO AD FOR ASTROLOGERS
         ───────────────────────────────────────────────────────────── */}
      {showAddAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#fde68a] rounded-3xl p-6 max-w-lg w-full space-y-4 text-xs font-sans text-[#0f172a] shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#fde68a]">
              <h4 className="font-serif font-bold text-xl text-[#b45309] flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#d97706]" />
                <span>Post Announcement / Promo Ad for Astrologers</span>
              </h4>
              <button onClick={() => setShowAddAnnouncementModal(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">Notice / Ad Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🚀 Mahashivratri Special Bonus Payout Promo!"
                  value={newAnnouncementForm.title}
                  onChange={(e) => setNewAnnouncementForm({ ...newAnnouncementForm, title: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">Notice Type</label>
                  <select
                    value={newAnnouncementForm.type}
                    onChange={(e) => setNewAnnouncementForm({ ...newAnnouncementForm, type: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs"
                  >
                    <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                    <option value="PROMO_AD">PROMO_AD</option>
                    <option value="URGENT_NOTICE">URGENT_NOTICE</option>
                    <option value="POLICY_UPDATE">POLICY_UPDATE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">Tag Badge Label</label>
                  <input
                    type="text"
                    placeholder="SPECIAL PROMO"
                    value={newAnnouncementForm.badge}
                    onChange={(e) => setNewAnnouncementForm({ ...newAnnouncementForm, badge: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-extrabold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">Message Content *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the announcement, promo rules, or policy update..."
                  value={newAnnouncementForm.message}
                  onChange={(e) => setNewAnnouncementForm({ ...newAnnouncementForm, message: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    placeholder="Check Now"
                    value={newAnnouncementForm.actionText}
                    onChange={(e) => setNewAnnouncementForm({ ...newAnnouncementForm, actionText: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">CTA Target Link</label>
                  <input
                    type="text"
                    placeholder="/dashboard/astrologer?tab=wallet"
                    value={newAnnouncementForm.actionUrl}
                    onChange={(e) => setNewAnnouncementForm({ ...newAnnouncementForm, actionUrl: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-blue-700 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#fde68a]">
                <button
                  type="button"
                  onClick={() => setShowAddAnnouncementModal(false)}
                  className="px-5 py-2 rounded-xl bg-[#fef3c7] text-[#b45309] font-bold text-xs border border-[#fde68a] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  Publish Announcement Live →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================== PROCESS ASTROLOGER PAYOUT MODAL ========================== */}
      {payoutModalAstro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleProcessPayoutSubmit}
            className="w-full max-w-lg rounded-3xl border border-[#fde68a] shadow-2xl p-6 sm:p-8 space-y-5 text-xs font-sans bg-white text-[#0f172a]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#fde68a] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#b45309]">
                    Disburse Astrologer Payout & Credit Wallet
                  </h3>
                  <p className="text-xs text-gray-500">
                    Settle earnings for {payoutModalAstro.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPayoutModalAstro(null)}
                className="p-1 cursor-pointer transition-colors text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Astrologer Info Card */}
            <div className="p-4 rounded-2xl border space-y-2 bg-[#fefcf6] border-[#fde68a] text-[#0f172a]">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-gray-500">Vendor Astrologer</span>
                <span className="text-xs font-bold text-[#b45309]">{payoutModalAstro.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-gray-500">Specialty</span>
                <span className="text-gray-700">{payoutModalAstro.specialty}</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#fde68a] pt-2">
                <span className="text-[10px] uppercase font-bold text-gray-500">Current Wallet Balance Pending</span>
                <strong className="font-mono text-base text-green-700 font-extrabold">₹{payoutModalAstro.pendingPayout.toLocaleString()}</strong>
              </div>
            </div>

            {/* Payout Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-[#b45309]">
                  Disbursement Payout Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100000}
                  value={payoutForm.amount}
                  onChange={(e) => setPayoutForm({ ...payoutForm, amount: Number(e.target.value) })}
                  className="w-full h-11 px-3.5 rounded-xl font-mono font-bold text-sm focus:border-[#d97706] focus:outline-none bg-[#fefcf6] border border-gray-300 text-[#b45309]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-[#b45309]">
                    Payment Settlement Mode *
                  </label>
                  <select
                    value={payoutForm.paymentMethod}
                    onChange={(e) => setPayoutForm({ ...payoutForm, paymentMethod: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl font-bold text-xs focus:border-[#d97706] focus:outline-none bg-[#fefcf6] border border-gray-300 text-[#0f172a]"
                  >
                    <option value="GPay / PhonePe UPI">GPay / PhonePe UPI</option>
                    <option value="Paytm Wallet / UPI">Paytm Wallet / UPI</option>
                    <option value="Bank Direct IMPS / NEFT">Bank Direct IMPS / NEFT</option>
                    <option value="Cash Disbursement">Cash Disbursement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-[#b45309]">
                    Transaction UTR / Ref No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UPI-20268940129"
                    value={payoutForm.utr}
                    onChange={(e) => setPayoutForm({ ...payoutForm, utr: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none bg-[#fefcf6] border border-gray-300 text-[#b45309]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-[#b45309]">
                  Settlement Remarks / Notes
                </label>
                <input
                  type="text"
                  value={payoutForm.notes}
                  onChange={(e) => setPayoutForm({ ...payoutForm, notes: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl text-xs focus:border-[#d97706] focus:outline-none bg-[#fefcf6] border border-gray-300 text-[#0f172a]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#fde68a]">
              <a
                href={`https://wa.me/${payoutModalAstro.whatsappNo.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(payoutModalAstro.name)},%20your%20KangleiAstro%20commission%20payout%20of%20%E2%82%B9${payoutForm.amount}%20has%20been%20processed%20successfully!%20Transaction%20UTR:%20${encodeURIComponent(payoutForm.utr)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Receipt</span>
              </a>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPayoutModalAstro(null)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#fef3c7] text-[#b45309] border border-[#fde68a] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Payout & Update Wallet</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: CREATE / EDIT PROMO COUPON */}
      {showCouponModal && editingCoupon && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c2541] w-full max-w-md rounded-3xl border border-[#3a506b] shadow-2xl p-6 sm:p-8 space-y-5 text-white relative">
            <div className="flex justify-between items-center border-b border-[#3a506b] pb-3">
              <h3 className="font-serif font-bold text-xl text-[#fbbf24]">
                {editingCoupon.id ? 'Edit Promo Coupon' : 'Create New Promo Coupon'}
              </h3>
              <button
                onClick={() => setShowCouponModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                  Coupon Code (Uppercase) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KANGLEI20"
                  value={editingCoupon.code || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-[#fbbf24] font-mono font-black text-sm uppercase tracking-wider focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                  Discount Type *
                </label>
                <select
                  value={editingCoupon.type || 'PERCENTAGE'}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, type: e.target.value as any })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs"
                >
                  <option value="PERCENTAGE">PERCENTAGE (% Off Subtotal)</option>
                  <option value="FLAT">FLAT (Flat ₹ Amount Off)</option>
                  <option value="FREE_SHIPPING">FREE_SHIPPING (Free Delivery Fee)</option>
                </select>
              </div>

              {editingCoupon.type !== 'FREE_SHIPPING' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                    Discount Value ({editingCoupon.type === 'PERCENTAGE' ? '% Percentage' : '₹ Amount'}) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder={editingCoupon.type === 'PERCENTAGE' ? '20' : '100'}
                    value={editingCoupon.value ?? ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, value: Number(e.target.value) })}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-emerald-400 font-mono font-extrabold text-sm focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                  Minimum Cart Subtotal Threshold (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  placeholder="499"
                  value={editingCoupon.minOrderAmount ?? ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrderAmount: Number(e.target.value) })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCoupon.active !== false}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, active: e.target.checked })}
                    className="rounded border-gray-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Activate Coupon for public use immediately</span>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="flex-1 py-3 rounded-xl border border-[#3a506b] text-gray-300 font-bold text-xs hover:bg-[#0b132b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs shadow-md hover:opacity-95"
                >
                  Save Promo Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT SHOP HERO SLIDER */}
      {showSliderModal && editingSlider && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c2541] w-full max-w-lg rounded-3xl border border-[#3a506b] shadow-2xl p-6 sm:p-8 space-y-5 text-white relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#3a506b] pb-3">
              <h3 className="font-serif font-bold text-xl text-[#fbbf24]">
                {editingSlider.id ? 'Edit Shop Hero Slider' : 'Create New Shop Hero Slider'}
              </h3>
              <button
                onClick={() => setShowSliderModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlider} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                  Top Badge Pill Text *
                </label>
                <input
                  type="text"
                  required
                  placeholder="✨ AUTHENTIC MANIPURI & VEDIC CONSECRATED STORE"
                  value={editingSlider.badge || ''}
                  onChange={(e) => setEditingSlider({ ...editingSlider, badge: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-[#fbbf24] font-bold text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                  Main Headline Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Sacred Vedic Remedies &"
                  value={editingSlider.title || ''}
                  onChange={(e) => setEditingSlider({ ...editingSlider, title: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-serif font-bold text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                  Highlight Text (Gold Underline)
                </label>
                <input
                  type="text"
                  placeholder="Lab-Certified Gemstones"
                  value={editingSlider.highlightText || ''}
                  onChange={(e) => setEditingSlider({ ...editingSlider, highlightText: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-[#fbbf24] font-serif font-bold text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                  Subtitle / Description Paragraph *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explore 100% genuine Ceylon Yellow Sapphires, traditional Kuthi reading books, 24k gold Shree Yantras..."
                  value={editingSlider.subtitle || ''}
                  onChange={(e) => setEditingSlider({ ...editingSlider, subtitle: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-gray-200 font-serif text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                  Featured Product Image URL *
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={editingSlider.image || ''}
                    onChange={(e) => setEditingSlider({ ...editingSlider, image: e.target.value })}
                    className="flex-1 h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-sky-300 font-mono text-xs focus:outline-none"
                  />
                  {editingSlider.image && (
                    <div className="w-11 h-11 rounded-xl border border-[#fbbf24] overflow-hidden bg-slate-900 shrink-0">
                      <img src={editingSlider.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                    CTA Button Text *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Shop Consecrated Gemstones"
                    value={editingSlider.ctaText || ''}
                    onChange={(e) => setEditingSlider({ ...editingSlider, ctaText: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                    CTA Target Link URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/shop?category=Gemstones"
                    value={editingSlider.ctaLink || ''}
                    onChange={(e) => setEditingSlider({ ...editingSlider, ctaLink: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-sky-300 font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                  Background Color Theme *
                </label>
                <select
                  value={editingSlider.bgColor || 'from-[#0b132b] via-[#1c2541] to-[#0b132b]'}
                  onChange={(e) => setEditingSlider({ ...editingSlider, bgColor: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs focus:outline-none"
                >
                  <option value="from-[#0b132b] via-[#1c2541] to-[#0b132b]">Midnight Navy (Default)</option>
                  <option value="from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]">Royal Indigo</option>
                  <option value="from-[#14532d] via-[#166534] to-[#064e3b]">Emerald Forest</option>
                  <option value="from-[#450a0a] via-[#7f1d1d] to-[#450a0a]">Deep Maroon</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSlider.active !== false}
                    onChange={(e) => setEditingSlider({ ...editingSlider, active: e.target.checked })}
                    className="rounded border-gray-600 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Publish slide live on /shop hero slider</span>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSliderModal(false)}
                  className="flex-1 py-3 rounded-xl border border-[#3a506b] text-gray-300 font-bold text-xs hover:bg-[#0b132b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95"
                >
                  Save Hero Slider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
