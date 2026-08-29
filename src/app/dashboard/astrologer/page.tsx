'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Moon, LayoutDashboard, FileText, Users, Settings, 
  Search, Bell, CheckCircle2, XCircle, ArrowUpRight, 
  ArrowDownLeft, MessageSquare, ShieldCheck, Lock, TrendingUp, 
  BarChart2, Calendar, Clock, LogOut, Check, ChevronDown, Menu,
  DollarSign, Filter, Share2, Award, Eye, Download, Copy, X, Sparkles, Save, Tag,
  Wallet, RefreshCw, Send, UploadCloud, Upload, User, Phone, Mail, MapPin, Paperclip,
  CheckCircle, AlertCircle, Edit, Star, Heart, Baby, FileCheck, KeyRound,
  Hash, Sun, Flame, Disc, Compass, Car, Grid, Globe, ShoppingBag, Plus, Image as ImageIcon
} from 'lucide-react';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
import SouthIndianChart from '@/components/charts/SouthIndianChart';
import BengaliChart from '@/components/charts/BengaliChart';
import { calculatePlanetaryPositions } from '@/engine/ephemeris';
import { calculateAllNavamsha, calculateNavamsha } from '@/engine/divisional';
import { calculateEqualHouses } from '@/engine/houses';
import { getNakshatraInfo } from '@/engine/nakshatras';
import { calculatePanchangaDetails } from '@/engine/panchanga';
import { ACTIVE_TOOLS_REGISTRY } from '@/config/toolsRegistry';

// Bengali Formatting Helpers
function toBengaliDigits(num: number | string): string {
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bengaliNumerals[parseInt(digit)]);
}

const BENGALI_PLANET_MAP: Record<string, { bengaliName: string; abbr: string }> = {
  su: { bengaliName: 'রবি', abbr: 'রবি' },
  mo: { bengaliName: 'চন্দ্র', abbr: 'চন্দ্র' },
  ma: { bengaliName: 'মঙ্গল', abbr: 'মঙ্গল' },
  me: { bengaliName: 'বুধ', abbr: 'বুধ' },
  ju: { bengaliName: 'বৃহস্পতি', abbr: 'বৃহ' },
  ve: { bengaliName: 'শুক্র', abbr: 'শুক্র' },
  sa: { bengaliName: 'শনি', abbr: 'শনি' },
  ra: { bengaliName: 'রাহু', abbr: 'রাহু' },
  ke: { bengaliName: 'কেতু', abbr: 'কেতু' },
  asc: { bengaliName: 'লগ্ন', abbr: 'লগ্ন' },
};

const BENGALI_RASHI_NAMES = [
  '০ - মেষ (Aries)',
  '১ - বৃষ (Taurus)',
  '২ - মিথুন (Gemini)',
  '৩ - কর্কট (Cancer)',
  '৪ - সিংহ (Leo)',
  '৫ - কন্যা (Virgo)',
  '৬ - তুলা (Libra)',
  '৭ - বৃশ্চিক (Scorpio)',
  '৮ - ধনু (Sagittarius)',
  '৯ - মকর (Capricorn)',
  '১০ - কুম্ভ (Aquarius)',
  '১১ - মীন (Pisces)',
];

function formatBengaliPositionString(
  planetId: string,
  nakshatraIndex: number, // 0-26
  signIndex: number, // 0-11
  signDegree: number // 0-29.99
): string {
  const planetName = BENGALI_PLANET_MAP[planetId]?.bengaliName || planetId;
  const nakNo = nakshatraIndex + 1; // 1-27
  const deg = Math.floor(signDegree);
  const min = Math.floor((signDegree % 1) * 60);
  const sec = Math.floor((((signDegree % 1) * 60) % 1) * 60);

  const nakStr = `(${toBengaliDigits(nakNo)})`;
  const rashiStr = toBengaliDigits(signIndex);
  const degStr = `${toBengaliDigits(deg)}।${toBengaliDigits(min)}।${toBengaliDigits(sec)}`;

  return `${planetName} ${nakStr} ${rashiStr}।${degStr}`;
}

// Types
type Status = 'ASSIGNED' | 'IN_ANALYSIS' | 'REPORT_RECEIVED' | 'COMPLETED';
type Availability = 'Online' | 'Offline' | 'On Leave';

interface ClientDetails {
  sex: string;
  mobile: string;
  whatsappNo: string;
  email: string;
  dob?: string;
  tob?: string;
  pob?: string;
  kuthiAttached: boolean;
  kuthiFileName?: string;
  kuthiFileUrl?: string;
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
  amount: number;
}

interface Order {
  id: string;
  clientName: string;
  serviceType: string;
  status: Status;
  date: string;
  payoutFee: number;
  clientDetails: ClientDetails;
}

interface WalletData {
  astroId: string;
  pendingPayout: number;
  totalPaidOut: number;
  totalEarnings: number;
  lastUpdated: string;
}

interface WalletTransaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  orderRef?: string;
  utr?: string;
  paymentMethod?: string;
  notes: string;
  timestamp: string;
}

export default function AstrologerDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [astroPasscodeInput, setAstroPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuthed = localStorage.getItem('kanglei_astro_authed') === 'true';
      const savedUser = localStorage.getItem('kanglei_user');
      if (isAuthed || (savedUser && JSON.parse(savedUser).role === 'ASTROLOGER')) {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleAstroLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const validPasscodes = ['astro123', 'guru2026', 'astro', '1234', '123456'];
    if (validPasscodes.includes(astroPasscodeInput.trim()) || astroPasscodeInput.trim().length >= 4) {
      localStorage.setItem('kanglei_astro_authed', 'true');
      setIsAuthenticated(true);
      setAstroPasscodeInput('');
    } else {
      setAuthError('❌ Invalid Passcode. Please enter at least 4 characters.');
    }
  };

  const handleAstroLogout = () => {
    localStorage.removeItem('kanglei_astro_authed');
    localStorage.removeItem('kanglei_user');
    setIsAuthenticated(false);
  };

  // Password Change Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdMsg('');

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match!');
      return;
    }

    if (newPassword.length < 4) {
      setPwdError('Password must be at least 4 characters long.');
      return;
    }

    setPwdLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CHANGE_PASSWORD',
          identifier: profileForm.phone || profileForm.whatsappNo || 'astro123',
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      setPwdLoading(false);

      if (!res.ok) {
        setPwdError(data.error || 'Password update failed.');
        return;
      }

      setPwdMsg('✅ Portal password updated successfully!');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPwdMsg('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err: any) {
      setPwdLoading(false);
      setPwdError(err.message || 'Failed to update password');
    }
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'wallet' | 'tools' | 'schedule' | 'profile' | 'astro_products' | 'astro_orders'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saveAlert, setSaveAlert] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Astrologer Vendor Store State
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [myShopOrders, setMyShopOrders] = useState<any[]>([]);
  const [editingAstroProduct, setEditingAstroProduct] = useState<any>(null);
  const [shopCategories, setShopCategories] = useState<string[]>(['Gemstones', 'Astrology Books', 'Yantras & Mala', 'Puja Items', 'Consecrated Remedies']);

  // Allowed Tools permitted by Admin (defaults to all active tools in registry)
  const [allowedTools, setAllowedTools] = useState<string[]>(ACTIVE_TOOLS_REGISTRY.map((t) => t.id));

  // Tool Calculation Modal & Form State inside Astrologer Dashboard
  const [activeToolModal, setActiveToolModal] = useState<any>(null);
  const [calcForm, setCalcForm] = useState({
    name: 'Sanatomba Meitei',
    sex: 'Male',
    partnerName: 'Thoibi Ningthoujam',
    dob: '1995-05-15',
    tob: '06:00',
    pob: 'Imphal, Manipur',
    lat: 24.8170,
    lng: 93.9368,
    timezone: 5.5,
    ayanamsa: 'Lahiri (Chitrapaksha)',
    vehicleNo: 'MN01AB1234',
  });
  const [calcResult, setCalcResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Theme State (Dark / Light) - Default to Light
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('astro_theme') as 'dark' | 'light';
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('astro_theme', nextTheme);
  };

  // Availability State
  const [availability, setAvailability] = useState<Availability>('Online');

  // Inspecting Client Details Modal State
  const [inspectingClient, setInspectingClient] = useState<Order | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([]);

  // Request Payout Modal State
  const [showRequestPayoutModal, setShowRequestPayoutModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState(3500);
  const [payoutMsg, setPayoutMsg] = useState('');
  const [loadingPayout, setLoadingPayout] = useState(false);

  // Upload Report Modal State
  const [uploadingOrder, setUploadingOrder] = useState<Order | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({
    reportFileName: '',
    reportFileUrl: '/sample_kuthi_report.pdf',
    reportNotes: '',
  });
  const [uploadMsg, setUploadMsg] = useState('');
  const [loadingUpload, setLoadingUpload] = useState(false);

  // Guru Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: 'Acharya Tombi Sharma',
    specialty: 'Vedic Horoscope & Kuthi Yengba Specialist',
    experience: '15 Years',
    pricePerMin: 35,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
    specialtiesStr: 'Kuthi Yengba, Vedic, Matching',
    languages: 'Manipuri · English · Hindi',
    phone: '+91 98620 99881',
    whatsappNo: '+91 98620 99881',
    email: 'tombi.sharma@kangleiastro.com',
    bio: 'Renowned Manipuri Vedic Astrologer specializing in traditional Kuthi Yengba analysis, Vimshottari Dasha predictions, Ashtakoot Gun Milan, and practical remedial measures.',
    maxDailyOrders: 5,
    morningSlot: true,
    afternoonSlot: true,
    eveningSlot: false,
  });

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileForm((prev) => ({ ...prev, avatar: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfileSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const updatedAstro = {
        id: 'astro-1',
        name: profileForm.name,
        badge: 'Celebrity',
        avatar: profileForm.avatar,
        specialties: profileForm.specialtiesStr.split(',').map((s) => s.trim()).filter(Boolean),
        languages: profileForm.languages,
        experienceYears: parseInt(profileForm.experience) || 15,
        pricePerMin: Number(profileForm.pricePerMin) || 35,
        whatsappPhone: profileForm.whatsappNo,
        email: profileForm.email,
        bio: profileForm.bio,
        online: availability === 'Online',
      };

      const res = await fetch('/api/astrologers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updateAstrologer: updatedAstro }),
      });

      if (res.ok) {
        setSaveAlert('✅ Guru Profile & Avatar photo updated live on public website!');
        setTimeout(() => setSaveAlert(''), 4000);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  // Wallet & Transactions State
  const [wallet, setWallet] = useState<WalletData>({
    astroId: 'astro-1',
    pendingPayout: 3500,
    totalPaidOut: 9250,
    totalEarnings: 12750,
    lastUpdated: '2026-08-26',
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx-101',
      type: 'CREDIT',
      amount: 599,
      orderRef: 'KY-2026-8939',
      notes: 'Consultation Fee Credited for Kuthi Yengba (Laishram Rajen)',
      timestamp: 'Yesterday, 04:25 PM',
    },
    {
      id: 'tx-102',
      type: 'DEBIT',
      amount: 2500,
      utr: 'UPI/62091823901/BANK_DISBURSEMENT',
      paymentMethod: 'UPI Direct Transfer',
      notes: 'Admin Payout Disbursement to GPay +91 98620 99881',
      timestamp: '24 Aug 2026, 02:15 PM',
    },
    {
      id: 'tx-103',
      type: 'CREDIT',
      amount: 779,
      orderRef: 'KY-2026-8942',
      notes: 'Consultation Fee Credited for Marriage Matching (Thoibi)',
      timestamp: 'Today, 10:15 AM',
    },
  ]);

  // Active Orders State
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'KY-2026-8942',
      clientName: 'Thoibi Ningthoujam',
      serviceType: 'Marriage Matching',
      status: 'ASSIGNED',
      date: 'Today, 09:40 AM',
      payoutFee: 779,
      clientDetails: {
        sex: 'Female',
        mobile: '+91 98561 88210',
        whatsappNo: '+91 98561 88210',
        email: 'thoibi@example.com',
        dob: '1996-04-12',
        tob: '08:30 AM',
        pob: 'Imphal East, Manipur',
        kuthiAttached: false,
        groomDetails: {
          name: 'Tomba Khangembam',
          dob: '1994-08-20',
          tob: '06:15 AM',
          pob: 'Thoubal, Manipur',
          long: '93.99',
          lat: '24.63',
        },
        brideDetails: {
          name: 'Thoibi Ningthoujam',
          dob: '1996-04-12',
          tob: '08:30 AM',
          pob: 'Imphal East, Manipur',
          long: '93.95',
          lat: '24.82',
        },
        question: 'Please check 36-Gun Ashtakoot compatibility and Manglik Dosh for both. Also suggest a favorable marriage date in 2026.',
        utr: '429810441920',
        amount: 1299,
      },
    },
    {
      id: 'KY-2026-8945',
      clientName: 'Ibomcha Singh',
      serviceType: 'Career Outlook',
      status: 'IN_ANALYSIS',
      date: 'Yesterday, 11:30 AM',
      payoutFee: 899,
      clientDetails: {
        sex: 'Male',
        mobile: '+91 97740 22150',
        whatsappNo: '+91 97740 22150',
        email: 'ibomcha@example.com',
        dob: '1988-11-05',
        tob: '02:45 PM',
        pob: 'Bishnupur, Manipur',
        kuthiAttached: true,
        kuthiFileName: 'ibomcha_kuthi_scan.pdf',
        kuthiFileUrl: '/sample_kuthi.pdf',
        question: 'Looking for promotion and business expansion opportunities in late 2026.',
        utr: '918230491823',
        amount: 1499,
      },
    },
    {
      id: 'KY-2026-8939',
      clientName: 'Laishram Rajen',
      serviceType: 'Kuthi Yengba',
      status: 'COMPLETED',
      date: 'Yesterday, 04:20 PM',
      payoutFee: 599,
      clientDetails: {
        sex: 'Male',
        mobile: '+91 94360 55120',
        whatsappNo: '+91 94360 55120',
        email: 'rajen@example.com',
        dob: '1992-07-14',
        tob: '05:10 AM',
        pob: 'Kakching, Manipur',
        kuthiAttached: true,
        kuthiFileName: 'rajen_paper_kuthi.jpg',
        kuthiFileUrl: '/sample_kuthi.pdf',
        question: 'Health concerns and Rahu Mahadasha remedies.',
        utr: '109283019283',
        amount: 999,
      },
    },
  ]);

  // Fetch live wallet data from /api/astrologers/payout
  const fetchWallet = () => {
    fetch('/api/astrologers/payout?astroId=astro-1')
      .then((res) => res.json())
      .then((data) => {
        if (data.wallet) setWallet(data.wallet);
        if (data.transactions && Array.isArray(data.transactions)) setTransactions(data.transactions);
      })
      .catch((err) => console.error('Error fetching astrologer wallet:', err));
  };

  // Fetch allowed tools assigned by Admin
  const fetchAllowedTools = () => {
    fetch('/api/astrologers')
      .then((res) => res.json())
      .then((data) => {
        if (data.astrologers && Array.isArray(data.astrologers)) {
          const myAstro = data.astrologers.find((a: any) => a.id === 'astro-1' || a.name.includes('Acharya Tombi'));
          if (myAstro && Array.isArray(myAstro.allowedTools) && myAstro.allowedTools.length > 0) {
            setAllowedTools(myAstro.allowedTools);
          } else {
            setAllowedTools(ACTIVE_TOOLS_REGISTRY.map((t) => t.id));
          }
        }
      })
      .catch((err) => console.error('Error fetching astrologer tools:', err));
  };

  // Fetch live orders assigned from /api/kuthi
  const fetchOrders = () => {
    fetch('/api/kuthi')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders && Array.isArray(data.orders)) {
          const assigned = data.orders.filter((o: any) => o.assignedAstrologerId === 'astro-1' || o.assignedAstrologerName?.includes('Acharya Tombi'));
          if (assigned.length > 0) {
            const mapped: Order[] = assigned.map((o: any) => ({
              id: o.orderRef || o.id,
              clientName: o.clientName,
              serviceType: o.serviceType || 'Kuthi Yengba Consultation',
              status: o.status || 'ASSIGNED',
              date: o.submittedAt || 'Today',
              payoutFee: o.amount ? Math.round(o.amount * 0.6) : 599,
              clientDetails: {
                sex: o.sex || 'Client',
                mobile: o.mobile,
                whatsappNo: o.whatsappNo || o.mobile,
                email: o.email || '',
                dob: o.dob,
                tob: o.tob,
                pob: o.pob,
                kuthiAttached: !!o.kuthiAttached,
                kuthiFileName: o.kuthiFileName,
                kuthiFileUrl: o.kuthiFileUrl,
                groomDetails: o.groomDetails,
                brideDetails: o.brideDetails,
                question: o.question,
                utr: o.utr || '429810441920',
                amount: o.amount || 499,
              },
            }));
            setOrders(mapped);
          }
        }
      })
      .catch((err) => console.error('Error fetching astrologer orders:', err));
  };

  const fetchAstroShopData = () => {
    fetch('/api/shop')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          const mine = data.products.filter(
            (p: any) => p.sellerId === 'astro-1' || p.sellerName?.includes('Acharya Tombi')
          );
          setMyProducts(mine);
        }
        if (data.orders && Array.isArray(data.orders)) {
          const mineOrders = data.orders.filter((o: any) =>
            o.items.some((it: any) => it.sellerId === 'astro-1' || it.sellerName?.includes('Acharya Tombi'))
          );
          setMyShopOrders(mineOrders);
        }
        if (data.categories) setShopCategories(data.categories);
      })
      .catch((err) => console.error('Error fetching astrologer shop data:', err));
  };

  const handleAstroProductImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setEditingAstroProduct((prev: any) => (prev ? { ...prev, image: dataUrl } : prev));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAstroProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAstroProduct?.title || !editingAstroProduct?.price) return;

    const prodPayload = {
      action: 'CREATE_PRODUCT',
      product: {
        id: editingAstroProduct.id || 'prod-a' + Date.now(),
        title: editingAstroProduct.title,
        category: editingAstroProduct.category || 'Consecrated Remedies',
        price: Number(editingAstroProduct.price),
        originalPrice: Number(editingAstroProduct.originalPrice || editingAstroProduct.price * 1.25),
        rating: 5.0,
        reviewsCount: 1,
        image: editingAstroProduct.image || 'https://images.unsplash.com/photo-1545232979-fbfd42e000b5?q=80&w=800&auto=format&fit=crop',
        badge: editingAstroProduct.badge || 'Consecrated Remedy',
        stock: Number(editingAstroProduct.stock || 10),
        description: editingAstroProduct.description || editingAstroProduct.title,
        features: editingAstroProduct.features || ['Consecrated at Guru Altar', 'Purified with Panchamrut Puja'],
        sellerType: 'ASTROLOGER',
        sellerId: 'astro-1',
        sellerName: 'Acharya Tombi Sharma',
        status: 'PENDING_APPROVAL',
      },
    };

    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prodPayload),
      });
      const data = await res.json();
      if (data.success) {
        setSaveAlert('✅ Product submitted! Awaiting Admin approval before listing live.');
        setEditingAstroProduct(null);
        fetchAstroShopData();
        setTimeout(() => setSaveAlert(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchOrders();
    fetchAllowedTools();
    fetchAstroShopData();
    fetch('/api/announcements')
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements && Array.isArray(data.announcements)) {
          setAnnouncements(data.announcements.filter((a: any) => a.isActive));
        }
      })
      .catch((err) => console.error('Error fetching announcements:', err));
  }, []);

  const handleStatusChange = (id: string, newStatus: Status) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
    );
    setSaveAlert(`Order ${id} status updated to ${newStatus}`);
    setTimeout(() => setSaveAlert(''), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setUploadForm((prev) => ({
        ...prev,
        reportFileName: file.name,
        reportFileUrl: objectUrl,
      }));
    }
  };

  const handleUploadReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadingOrder) return;
    setLoadingUpload(true);
    setUploadMsg('');

    try {
      const res = await fetch('/api/kuthi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPLOAD_REPORT',
          orderId: uploadingOrder.id,
          reportFileName: uploadForm.reportFileName,
          reportFileUrl: uploadForm.reportFileUrl,
          reportNotes: uploadForm.reportNotes,
          uploadedBy: profileForm.name,
        }),
      });

      if (!res.ok) {
        setUploadMsg('❌ Error uploading report. Please try again.');
        setLoadingUpload(false);
        return;
      }

      // Add earning credit to wallet
      await fetch('/api/astrologers/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_EARNING',
          astroId: 'astro-1',
          amount: uploadingOrder.payoutFee,
          orderRef: uploadingOrder.id,
          notes: `Consultation Fee Credited for ${uploadingOrder.serviceType} (${uploadingOrder.clientName})`,
        }),
      });

      handleStatusChange(uploadingOrder.id, 'COMPLETED');
      fetchWallet();

      setUploadMsg('✅ Consultation Report uploaded & wallet credited successfully!');
      setLoadingUpload(false);
      setTimeout(() => {
        setUploadingOrder(null);
        setUploadMsg('');
        setSelectedFile(null);
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoadingUpload(false);
      setUploadMsg('❌ Network error during report upload.');
    }
  };

  const handleRequestPayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPayout(true);
    setPayoutMsg('');

    try {
      const res = await fetch('/api/astrologers/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REQUEST_PAYOUT',
          astroId: 'astro-1',
          amount: requestAmount,
          notes: `Payout request of ₹${requestAmount} submitted to Admin`,
        }),
      });

      const data = await res.json();
      setLoadingPayout(false);

      if (!res.ok) {
        setPayoutMsg(data.error || 'Failed to submit request');
        return;
      }

      setPayoutMsg(`✅ Payout request for ₹${requestAmount} submitted to Admin!`);
      setTimeout(() => {
        setShowRequestPayoutModal(false);
        setPayoutMsg('');
      }, 1500);
    } catch (err) {
      setLoadingPayout(false);
      setPayoutMsg('Failed to submit payout request');
    }
  };

  const handleCopyClientDetails = (order: Order) => {
    const details = order.clientDetails;
    const summary = `Client: ${order.clientName} (${details.sex})
Mobile: ${details.mobile}
WhatsApp: ${details.whatsappNo}
Email: ${details.email}
DOB: ${details.dob || 'Attached in Kuthi Document'}
TOB: ${details.tob || 'Attached in Kuthi Document'}
POB: ${details.pob || 'Attached in Kuthi Document'}
Question: ${details.question || 'N/A'}`;

    navigator.clipboard.writeText(summary);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const pendingCount = orders.filter((o) => o.status !== 'COMPLETED').length;
  const filteredOrders = orders.filter((o) =>
    o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ASTROLOGER PASSCODE AUTHENTICATION GATE
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 font-sans transition-colors ${
        theme === 'dark' ? 'bg-[#0b132b] text-white' : 'bg-[#faf8f5] text-slate-900'
      }`}>
        <div className="w-full max-w-md bg-white dark:bg-[#1c2541] rounded-3xl border border-amber-300 dark:border-[#3a506b] shadow-2xl p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-[#0b132b] border border-amber-300 dark:border-[#fbbf24]/40 text-[#d97706] flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-8 h-8 text-[#d97706]" />
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 text-[11px] font-extrabold uppercase tracking-wider inline-block">
              ✦ Empaneled Vedic Guru Clearance
            </span>
            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
              Astrologer Access Portal
            </h2>
            <p className="text-xs text-slate-600 dark:text-gray-400">
              Please enter your registered astrologer passcode to access assigned Kuthi consultations & 19 calculators.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-bold text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleAstroLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1.5">
                Astrologer Passcode <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter passcode (e.g. astro123)"
                value={astroPasscodeInput}
                onChange={(e) => setAstroPasscodeInput(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-[#3a506b] bg-slate-50 dark:bg-[#0b132b] text-slate-900 dark:text-white font-mono font-bold text-sm focus:border-[#d97706] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Astrologer Dashboard</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-[#3a506b]/40 text-center">
            <p className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">
              Demo Passcode: <code className="bg-amber-100 text-amber-900 dark:bg-[#0b132b] dark:text-[#fbbf24] px-2 py-0.5 rounded font-mono font-bold">astro123</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans flex flex-col md:flex-row transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0b132b] text-[#faf8f4]' : 'bg-[#faf8f5] text-[#0f172a]'
    }`}>
      
      {/* ─────────────────────────────────────────────────────────────
         1. LEFT NAVIGATION SIDEBAR (Admin Portal Style)
         ───────────────────────────────────────────────────────────── */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-72 border-r flex flex-col justify-between z-40 transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#0f172a] border-[#3a506b]' : 'bg-white border-slate-200 shadow-md'
      } ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div>
          {/* Logo & Portal Title */}
          <div className="p-6 border-b border-[#3a506b] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d97706] to-[#f59e0b] text-white flex items-center justify-center font-bold shadow-lg">
                <Moon className="w-5 h-5 fill-[#fbbf24] text-[#fbbf24]" />
              </div>
              <div>
                <span className={`font-serif text-lg font-bold block leading-tight ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  KangleiAstro
                </span>
                <span className="text-[10px] text-[#d97706] font-extrabold uppercase tracking-wider block">
                  Guru Portal
                </span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links (Admin Style Categorized Menu) */}
          <div className="p-4 space-y-6">
            
            {/* Category 1: WORKSPACE */}
            <div>
              <span className={`text-[10px] uppercase tracking-wider block px-3 mb-2 font-extrabold ${
                theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-800'
              }`}>
                Workspace
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Overview & Analytics</span>
                  </div>
                </button>

                <button
                  onClick={() => { setActiveTab('consultations'); setSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'consultations'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4" />
                    <span>Assigned Consultations</span>
                  </div>
                  {pendingCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#78350f] text-[10px] font-extrabold">
                      {pendingCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => { setActiveTab('wallet'); setSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'wallet'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="w-4 h-4" />
                    <span>My Wallet & Payouts</span>
                  </div>
                  <span className="text-[10px] font-mono font-extrabold text-emerald-600">
                    ₹{wallet.pendingPayout.toLocaleString()}
                  </span>
                </button>
              </div>
            </div>

            {/* Category 1B: MY ASTROLOGER STORE */}
            <div>
              <span className={`text-[10px] uppercase tracking-wider block px-3 mb-2 font-extrabold ${
                theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-800'
              }`}>
                🛒 My Astrologer Store
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveTab('astro_products'); setSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'astro_products'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-[#d97706]" />
                    <span>My Products & Stock</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {myProducts.length}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('astro_orders'); setSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'astro_orders'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Tag className="w-4 h-4" />
                    <span>Seller Sales & Orders</span>
                  </div>
                  {myShopOrders.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 text-[10px] font-extrabold border border-emerald-500/30">
                      {myShopOrders.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Category 2: GURU CONTROL */}
            <div>
              <span className={`text-[10px] uppercase tracking-wider block px-3 mb-2 font-extrabold ${
                theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-800'
              }`}>
                Guru Controls
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveTab('schedule'); setSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'schedule'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4" />
                    <span>Availability & Shifts</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                    availability === 'Online' ? 'bg-green-500/20 text-green-700 border border-green-500/30' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {availability}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('tools'); setSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'tools'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#d97706]" />
                    <span>Astrological Calculators</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {allowedTools.length}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4" />
                    <span>Guru Profile & Bio</span>
                  </div>
                </button>

                <button
                  onClick={() => setShowPasswordModal(true)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    theme === 'dark' ? 'text-amber-300 hover:bg-[#1e293b]' : 'text-amber-800 hover:bg-amber-50 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Update Password</span>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer User Info & Logout */}
        <div className={`p-4 border-t transition-colors duration-300 ${
          theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#d97706] text-white flex items-center justify-center font-bold text-sm shadow-md">
                AT
              </div>
              <div className="overflow-hidden">
                <span className={`font-bold text-xs block truncate ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>{profileForm.name}</span>
                <span className={`text-[10px] block truncate ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                }`}>{profileForm.specialty}</span>
              </div>
            </div>
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              availability === 'Online' ? 'bg-green-500 ring-4 ring-green-500/20' : 'bg-gray-500'
            }`} />
          </div>

          <button
            onClick={handleAstroLogout}
            className={`w-full py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#1e293b] text-gray-300 border-[#3a506b] hover:bg-red-900/30 hover:border-red-500/50 hover:text-red-300'
                : 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
         2. MAIN CONTENT AREA (Admin Header + Dynamic Workspace)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP ADMIN HEADER BAR */}
        <header className={`border-b px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300 shadow-md ${
          theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white/90 backdrop-blur-md border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-2 rounded-xl border md:hidden ${
                theme === 'dark' ? 'bg-[#0b132b] text-gray-300 border-[#3a506b]' : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`font-serif font-bold text-xl flex items-center gap-2 ${
                theme === 'dark' ? 'text-[#faf8f4]' : 'text-slate-900'
              }`}>
                <span>Welcome, {profileForm.name}</span>
                <ShieldCheck className="w-5 h-5 text-[#fbbf24]" />
              </h1>
              <p className="text-xs text-[#5c7a99]">
                Empaneled Astrologer Management Portal • KangleiAstro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Search Bar */}
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-4 py-1.5 rounded-xl border text-xs focus:outline-none focus:border-[#d97706] w-48 lg:w-64 transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#0b132b] border-[#3a506b] text-white placeholder-gray-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-xs'
                }`}
              />
            </div>

            {/* Theme Selector Option (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#0b132b] text-[#fbbf24] border-[#3a506b] hover:border-[#fbbf24]'
                  : 'bg-white text-slate-800 border-amber-300 hover:border-amber-500 shadow-xs'
              }`}
              title="Switch Light / Dark Theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="hidden md:inline font-mono">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700 fill-slate-700" />
                  <span className="hidden md:inline font-mono">Dark Mode</span>
                </>
              )}
            </button>

            {/* Quick Availability Switcher */}
            <div className={`flex items-center p-1 rounded-xl border transition-colors ${
              theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-100 border-slate-200'
            }`}>
              {(['Online', 'Offline', 'On Leave'] as Availability[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setAvailability(st)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    availability === st
                      ? st === 'Online' ? 'bg-green-600 text-white shadow-xs' : st === 'Offline' ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
                      : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Global Save / Action Alert Box */}
        {saveAlert && (
          <div className="bg-[#d97706] text-white text-xs font-bold py-2.5 px-6 flex items-center justify-between border-b border-[#f59e0b]">
            <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveAlert}</span>
            </div>
          </div>
        )}

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          
          {/* ADMIN ANNOUNCEMENTS & ADVERTISEMENT BANNER CAROUSEL */}
          {announcements.filter((a) => !dismissedAnnouncements.includes(a.id)).length > 0 && (
            <div className="space-y-3">
              {announcements
                .filter((a) => !dismissedAnnouncements.includes(a.id))
                .map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-5 rounded-3xl border shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                      theme === 'dark'
                        ? ann.type === 'PROMO_AD'
                          ? 'bg-gradient-to-r from-purple-950 via-[#1c2541] to-[#0b132b] border-purple-500/50 text-white'
                          : ann.type === 'URGENT_NOTICE'
                          ? 'bg-gradient-to-r from-amber-950 via-[#1c2541] to-[#0b132b] border-amber-500/50 text-white'
                          : 'bg-gradient-to-r from-blue-950 via-[#1c2541] to-[#0b132b] border-blue-500/50 text-white'
                        : ann.type === 'PROMO_AD'
                        ? 'bg-gradient-to-r from-purple-50 via-white to-purple-50 border-purple-300 text-slate-900 shadow-sm'
                        : ann.type === 'URGENT_NOTICE'
                        ? 'bg-gradient-to-r from-amber-50 via-white to-amber-50 border-amber-300 text-slate-900 shadow-sm'
                        : 'bg-gradient-to-r from-sky-50 via-white to-sky-50 border-sky-300 text-slate-900 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {ann.imageUrl ? (
                        <img
                          src={ann.imageUrl}
                          alt={ann.title}
                          className="w-14 h-14 object-cover rounded-2xl border border-white/20 shrink-0 hidden sm:block"
                        />
                      ) : (
                        <div className={`p-3 rounded-2xl border shrink-0 ${
                          theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200'
                        }`}>
                          <Bell className={`w-6 h-6 ${
                            ann.type === 'PROMO_AD' ? 'text-purple-500' : ann.type === 'URGENT_NOTICE' ? 'text-amber-500' : 'text-sky-500'
                          }`} />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                            ann.type === 'PROMO_AD' ? 'bg-purple-500/20 text-purple-600 border-purple-500/30' :
                            ann.type === 'URGENT_NOTICE' ? 'bg-amber-500/20 text-amber-600 border-amber-500/30' :
                            'bg-sky-500/20 text-sky-600 border-sky-500/30'
                          }`}>
                            {ann.type.replace('_', ' ')}
                          </span>
                          <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Audience: {ann.targetAudience}</span>
                        </div>
                        <h4 className={`font-serif font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{ann.title}</h4>
                        <p className={`text-xs mt-0.5 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700 font-medium'}`}>{ann.message}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      {ann.actionText && (
                        <a
                          href={ann.actionUrl || '#'}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 transition-opacity font-sans"
                        >
                          {ann.actionText} →
                        </a>
                      )}
                      <button
                        onClick={() => setDismissedAnnouncements((prev) => [...prev, ann.id])}
                        className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                          theme === 'dark'
                            ? 'bg-[#0b132b]/80 hover:bg-[#0b132b] text-gray-400 hover:text-white border-[#3a506b]'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-300'
                        }`}
                        title="Dismiss notice"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* TAB 1: OVERVIEW & STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* 5 Admin-Style Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className={`p-5 rounded-2xl border relative overflow-hidden group transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-slate-700 font-extrabold'}`}>Assigned Orders</span>
                    <div className="p-2 rounded-xl bg-[#d97706]/20 text-[#d97706]">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <strong className={`text-3xl font-serif font-bold block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{orders.length}</strong>
                  <span className={`text-[10px] mt-1 block font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Active Consultation Queue</span>
                </div>

                <div className={`p-5 rounded-2xl border relative overflow-hidden group transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-slate-700 font-extrabold'}`}>Pending Analysis</span>
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <strong className="text-3xl font-serif font-bold text-amber-600 block">{pendingCount}</strong>
                  <span className={`text-[10px] mt-1 block font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Awaiting Report Upload</span>
                </div>

                <div className={`p-5 rounded-2xl border relative overflow-hidden group transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-slate-700 font-extrabold'}`}>Submitted Reports</span>
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600">
                      <FileCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <strong className="text-3xl font-serif font-bold text-emerald-600 block">
                    {orders.filter(o => o.status === 'COMPLETED').length}
                  </strong>
                  <span className={`text-[10px] mt-1 block font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Delivered to Clients</span>
                </div>

                <div className={`p-5 rounded-2xl border relative overflow-hidden group transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-slate-700 font-extrabold'}`}>Total Earnings</span>
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-600">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <strong className="text-3xl font-serif font-bold text-purple-600 block">₹{wallet.totalEarnings.toLocaleString()}</strong>
                  <span className={`text-[10px] mt-1 block font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Cumulative Consultation Fees</span>
                </div>

                <div className={`p-5 rounded-2xl border relative overflow-hidden group transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-slate-700 font-extrabold'}`}>Pending Payout</span>
                    <div className="p-2 rounded-xl bg-green-500/20 text-green-600">
                      <Wallet className="w-5 h-5" />
                    </div>
                  </div>
                  <strong className="text-3xl font-serif font-bold text-green-600 block">₹{wallet.pendingPayout.toLocaleString()}</strong>
                  <button
                    onClick={() => setShowRequestPayoutModal(true)}
                    className="mt-2 text-[11px] font-bold text-[#d97706] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Request Payout</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Active Consultation Table */}
              <div className={`rounded-3xl border shadow-xl overflow-hidden transition-colors ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className={`p-6 border-b flex flex-wrap justify-between items-center gap-4 ${
                  theme === 'dark' ? 'border-[#3a506b]' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div>
                    <h3 className={`font-serif font-bold text-xl ${theme === 'dark' ? 'text-[#faf8f4]' : 'text-slate-900'}`}>Active Consultation Queue</h3>
                    <p className={`text-xs ${theme === 'dark' ? 'text-[#5c7a99]' : 'text-slate-600'}`}>Inspect client birth data, Kuthi papers, & upload completed reports</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('consultations')}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      theme === 'dark' ? 'bg-[#0b132b] text-[#fbbf24] border-[#3a506b] hover:border-[#fbbf24]' : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 shadow-xs'
                    }`}
                  >
                    <span>View All Orders</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b font-serif uppercase tracking-wider ${
                        theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-[#fbbf24]' : 'bg-slate-100 border-slate-200 text-slate-900 font-extrabold'
                      }`}>
                        <th className="p-4">Order Ref</th>
                        <th className="p-4">Client Name</th>
                        <th className="p-4">Service Type</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Payout Fee</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#3a506b]/50' : 'divide-slate-200 text-slate-900 font-medium'}`}>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-[#0b132b]/40' : 'hover:bg-slate-50'}`}>
                          <td className={`p-4 font-mono font-bold ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-800'}`}>{order.id}</td>
                          <td className="p-4 font-bold">
                            <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{order.clientName}</span>
                            <span className={`text-[10px] block font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>{order.clientDetails.sex}</span>
                          </td>
                          <td className={`p-4 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{order.serviceType}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                              order.status === 'ASSIGNED' ? 'bg-blue-500/20 text-blue-700 border-blue-500/30' :
                              order.status === 'IN_ANALYSIS' ? 'bg-purple-500/20 text-purple-700 border-purple-500/30' :
                              'bg-green-500/20 text-green-700 border-green-500/30'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-emerald-600">+₹{order.payoutFee}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setInspectingClient(order)}
                                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 border transition-colors ${
                                  theme === 'dark'
                                    ? 'bg-[#0b132b] hover:bg-[#1e293b] text-sky-300 border-[#3a506b]'
                                    : 'bg-sky-50 hover:bg-sky-100 text-sky-900 border-sky-200'
                                }`}
                              >
                                <Eye className="w-3.5 h-3.5 text-sky-500" />
                                <span>Details</span>
                              </button>
                              {order.status !== 'COMPLETED' ? (
                                <button
                                  onClick={() => setUploadingOrder(order)}
                                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs hover:opacity-95"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Upload Report</span>
                                </button>
                              ) : (
                                <span className="px-2.5 py-1 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 font-bold text-[10px] flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-green-600" /> Done
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ASSIGNED CONSULTATIONS */}
          {activeTab === 'consultations' && (
            <div className="space-y-6">
              <div className="bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#faf8f4]">Assigned Consultations & Kuthi Orders</h3>
                  <p className="text-xs text-[#5c7a99]">Access client submitted birth details, inspect paper Kuthi uploads, & deliver astrological reports</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block font-mono">Assigned Orders Count</span>
                  <strong className="text-xl font-serif font-bold text-[#fbbf24]">{orders.length} Total</strong>
                </div>
              </div>

              {/* Consultations Table */}
              <div className="bg-[#1c2541] rounded-3xl border border-[#3a506b] shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0b132b] border-b border-[#3a506b] text-[#fbbf24] font-serif uppercase tracking-wider">
                        <th className="p-4">Order Ref</th>
                        <th className="p-4">Client Info</th>
                        <th className="p-4">Kuthi / Birth Paper</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Payout Fee</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3a506b]/50">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#0b132b]/40 transition-colors">
                          <td className="p-4 font-mono font-bold text-[#fbbf24]">{order.id}</td>
                          <td className="p-4">
                            <strong className="text-white text-sm block">{order.clientName}</strong>
                            <span className="text-gray-400 text-[11px] block">{order.clientDetails.mobile}</span>
                          </td>
                          <td className="p-4">
                            {order.clientDetails.kuthiAttached ? (
                              <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                                <Paperclip className="w-3.5 h-3.5 text-amber-400" />
                                {order.clientDetails.kuthiFileName || 'Paper Kuthi Uploaded'}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400 italic">Birth Details Mode</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                              order.status === 'ASSIGNED' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                              order.status === 'IN_ANALYSIS' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                              'bg-green-500/20 text-green-300 border-green-500/30'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-green-400">+₹{order.payoutFee}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setInspectingClient(order)}
                                className="px-3 py-1.5 rounded-xl bg-[#0b132b] hover:bg-[#1e293b] text-sky-300 border border-[#3a506b] font-bold text-[11px] flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5 text-sky-400" />
                                <span>Inspect Details</span>
                              </button>
                              <button
                                onClick={() => setUploadingOrder(order)}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs hover:opacity-95"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Report</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WALLET & EARNINGS */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#faf8f4]">My Wallet & Payout Ledger</h3>
                  <p className="text-xs text-[#5c7a99]">Track consultation earnings, requested disbursements, & live Admin settlement UTR records</p>
                </div>
                <button
                  onClick={() => setShowRequestPayoutModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Payout to Admin</span>
                </button>
              </div>

              {/* 3 Wallet Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] space-y-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Lifetime Earnings</span>
                  <strong className="text-3xl font-serif font-bold text-purple-300 block">₹{wallet.totalEarnings.toLocaleString()}</strong>
                  <p className="text-[10px] text-gray-400">Total consultation revenue split accrued</p>
                </div>
                <div className="bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] space-y-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Paid Out</span>
                  <strong className="text-3xl font-serif font-bold text-sky-300 block">₹{wallet.totalPaidOut.toLocaleString()}</strong>
                  <p className="text-[10px] text-gray-400">Disbursed via UPI / Bank Transfer by Admin</p>
                </div>
                <div className="bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-green-500/10">
                    <Wallet className="w-20 h-20" />
                  </div>
                  <span className="text-xs font-bold text-green-400 uppercase tracking-wider block">Available Wallet Balance</span>
                  <strong className="text-3xl font-serif font-bold text-green-400 block">₹{wallet.pendingPayout.toLocaleString()}</strong>
                  <p className="text-[10px] text-gray-400">Ready for instant payout withdrawal</p>
                </div>
              </div>

              {/* Transactions Ledger Table */}
              <div className="bg-[#1c2541] rounded-3xl border border-[#3a506b] shadow-xl overflow-hidden">
                <div className="p-6 border-b border-[#3a506b]">
                  <h4 className="font-serif font-bold text-lg text-[#fbbf24]">Transaction History Ledger</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0b132b] border-b border-[#3a506b] text-[#fbbf24] uppercase tracking-wider">
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Details / Description</th>
                        <th className="p-4">UTR / Ref</th>
                        <th className="p-4 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3a506b]/50 font-mono">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-[#0b132b]/40">
                          <td className="p-4 font-bold text-gray-300">{tx.id}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.type === 'CREDIT' ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="p-4 text-gray-200 font-sans">{tx.notes}</td>
                          <td className="p-4 text-gray-400">{tx.utr || tx.orderRef || 'N/A'}</td>
                          <td className={`p-4 text-right font-bold ${tx.type === 'CREDIT' ? 'text-green-400' : 'text-amber-400'}`}>
                            {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AVAILABILITY & SHIFTS */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] space-y-4">
                <h3 className="font-serif font-bold text-2xl text-[#faf8f4]">Availability & Working Shift Controls</h3>
                <p className="text-xs text-[#5c7a99]">Set your real-time status and maximum daily consultation capacity</p>
                
                <div className="p-6 rounded-2xl bg-[#0b132b] border border-[#3a506b] space-y-4">
                  <label className="block text-xs font-bold text-[#fbbf24] uppercase tracking-wider">
                    Current Online Availability Status
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {(['Online', 'Offline', 'On Leave'] as Availability[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          setAvailability(st);
                          setSaveAlert(`Status changed to ${st}`);
                          setTimeout(() => setSaveAlert(''), 3000);
                        }}
                        className={`px-6 py-3 rounded-2xl font-bold text-xs border transition-all ${
                          availability === st
                            ? st === 'Online' ? 'bg-green-600 border-green-500 text-white shadow-lg' : st === 'Offline' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-red-600 border-red-500 text-white'
                            : 'bg-[#1c2541] border-[#3a506b] text-gray-300 hover:border-[#fbbf24]'
                        }`}
                      >
                        {st === 'Online' ? '🟢 Online & Ready for Orders' : st === 'Offline' ? '⚪ Offline' : '🔴 On Leave'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="p-6 rounded-2xl bg-[#0b132b] border border-[#3a506b] space-y-3">
                    <label className="block text-xs font-bold text-white uppercase tracking-wider">
                      Max Daily Consultation Limit
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={profileForm.maxDailyOrders}
                      onChange={(e) => setProfileForm({ ...profileForm, maxDailyOrders: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl bg-[#1c2541] border border-[#3a506b] text-amber-300 font-mono font-bold text-sm"
                    />
                    <p className="text-[10px] text-gray-400">Admin will stop assigning new orders once this limit is reached in a 24-hr period.</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0b132b] border border-[#3a506b] space-y-3">
                    <label className="block text-xs font-bold text-white uppercase tracking-wider">
                      Shift Hours Configuration
                    </label>
                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileForm.morningSlot}
                          onChange={(e) => setProfileForm({ ...profileForm, morningSlot: e.target.checked })}
                          className="rounded text-[#d97706]"
                        />
                        <span>Morning Shift (09:00 AM – 01:00 PM IST)</span>
                      </label>
                      <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileForm.afternoonSlot}
                          onChange={(e) => setProfileForm({ ...profileForm, afternoonSlot: e.target.checked })}
                          className="rounded text-[#d97706]"
                        />
                        <span>Afternoon Shift (02:00 PM – 06:00 PM IST)</span>
                      </label>
                      <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileForm.eveningSlot}
                          onChange={(e) => setProfileForm({ ...profileForm, eveningSlot: e.target.checked })}
                          className="rounded text-[#d97706]"
                        />
                        <span>Evening Shift (07:00 PM – 10:00 PM IST)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GURU PROFILE & BIO */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-[#faf8f4]">Empaneled Guru Profile & Bio</h3>
                    <p className="text-xs text-[#5c7a99]">Upload profile photo, manage credentials, consultation rate, & bio shown to clients</p>
                  </div>
                  <button
                    onClick={handleSaveProfileSubmit}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Live</span>
                  </button>
                </div>

                {/* Profile Photo Upload & Preview Card */}
                <div className="bg-[#0b132b] p-5 rounded-2xl border border-[#3a506b] flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-500 p-0.5 shadow-lg bg-[#1c2541] shrink-0">
                      <img
                        src={profileForm.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80'}
                        alt={profileForm.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-1 right-1 shadow-md" title="Online Status Ring" />
                  </div>

                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-white">{profileForm.name}</h4>
                      <p className="text-xs text-amber-300 font-mono">{profileForm.specialty}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      <label className="px-4 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs cursor-pointer flex items-center gap-2 shadow-sm transition-colors">
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload Photo From Computer / Phone</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileChange}
                          className="hidden"
                        />
                      </label>

                      <div className="text-[11px] text-gray-400">or enter image URL below</div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-semibold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Profile Photo Image URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-sky-300 font-mono text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Specialty Tagline *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.specialty}
                      onChange={(e) => setProfileForm({ ...profileForm, specialty: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-semibold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Consultation Rate (₹ per Minute) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-amber-400 font-bold">₹</span>
                      <input
                        type="number"
                        required
                        min={10}
                        max={500}
                        value={profileForm.pricePerMin}
                        onChange={(e) => setProfileForm({ ...profileForm, pricePerMin: Number(e.target.value) })}
                        className="w-full p-3 pl-8 rounded-xl bg-[#0b132b] border border-[#3a506b] text-amber-300 font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Years of Experience (e.g. 15) *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.experience}
                      onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-semibold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Languages Spoken *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.languages}
                      onChange={(e) => setProfileForm({ ...profileForm, languages: e.target.value })}
                      placeholder="e.g. Manipuri · English · Hindi"
                      className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-semibold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Specialty Tags (Comma Separated) *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.specialtiesStr}
                      onChange={(e) => setProfileForm({ ...profileForm, specialtiesStr: e.target.value })}
                      placeholder="e.g. Kuthi Yengba, Vedic, Matching"
                      className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-amber-300 text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      WhatsApp Contact Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.whatsappNo}
                      onChange={(e) => setProfileForm({ ...profileForm, whatsappNo: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-amber-300 font-mono text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Official Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Astrological Bio & Credentials Summary *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white text-xs leading-relaxed focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Profile & Sync Live</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 1B: ASTROLOGER VENDOR PRODUCTS MANAGEMENT */}
          {activeTab === 'astro_products' && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] gap-4 shadow-xl">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbbf24]/20 text-[#fbbf24] text-xs font-extrabold uppercase mb-2 border border-[#fbbf24]/30">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Astrologer Seller Product Catalog
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-[#faf8f4]">
                    Sell Your Consecrated Remedies & Yantras
                  </h3>
                  <p className="text-xs text-gray-400">
                    Add custom consecrated Shivlingas, energized rosaries, or specialized remedies to sell directly on KangleiAstro Store. (Admin approval required before listing).
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEditingAstroProduct({
                      title: '',
                      category: 'Consecrated Remedies',
                      price: 1499,
                      originalPrice: 1999,
                      stock: 10,
                      badge: 'Pandit Consecrated',
                      image: 'https://images.unsplash.com/photo-1545232979-fbfd42e000b5?q=80&w=800&auto=format&fit=crop',
                      description: 'Consecrated personally at Guru Puja Altar.',
                      features: ['Authentic 8-Stage Purified', 'Consecrated with Vedic Mantras'],
                    })
                  }
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Submit New Product</span>
                </button>
              </div>

              {/* ASTROLOGER SUBMIT PRODUCT MODAL */}
              {editingAstroProduct && (
                <form onSubmit={handleSaveAstroProduct} className="bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] space-y-4 text-xs font-sans text-white shadow-2xl">
                  <div className="flex justify-between items-center pb-3 border-b border-[#3a506b]">
                    <h4 className="font-serif font-bold text-xl text-[#fbbf24]">
                      Submit Product to E-Store (Requires Admin Verification)
                    </h4>
                    <button type="button" onClick={() => setEditingAstroProduct(null)} className="p-1 text-gray-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-8">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Consecrated Parad Shivlinga 150g"
                        value={editingAstroProduct.title || ''}
                        onChange={(e) => setEditingAstroProduct({ ...editingAstroProduct, title: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">Category *</label>
                      <select
                        value={editingAstroProduct.category || shopCategories[0] || 'Consecrated Remedies'}
                        onChange={(e) => setEditingAstroProduct({ ...editingAstroProduct, category: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs"
                      >
                        {shopCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">Selling Price (₹) *</label>
                      <input
                        type="number"
                        required
                        placeholder="1899"
                        value={editingAstroProduct.price || ''}
                        onChange={(e) => setEditingAstroProduct({ ...editingAstroProduct, price: Number(e.target.value) })}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-[#fbbf24] font-mono font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">Original MRP (₹)</label>
                      <input
                        type="number"
                        placeholder="2499"
                        value={editingAstroProduct.originalPrice || ''}
                        onChange={(e) => setEditingAstroProduct({ ...editingAstroProduct, originalPrice: Number(e.target.value) })}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-gray-300 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">Stock Quantity *</label>
                      <input
                        type="number"
                        required
                        placeholder="10"
                        value={editingAstroProduct.stock ?? 10}
                        onChange={(e) => setEditingAstroProduct({ ...editingAstroProduct, stock: Number(e.target.value) })}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-green-400 font-mono font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">Product Description Copy *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Describe the spiritual & astrological benefits..."
                      value={editingAstroProduct.description || ''}
                      onChange={(e) => setEditingAstroProduct({ ...editingAstroProduct, description: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                        Authenticity Badge / Tag
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Consecrated & Energized by Master Pandit"
                        value={editingAstroProduct.badge || 'Consecrated & Energized by Master Pandit'}
                        onChange={(e) => setEditingAstroProduct({ ...editingAstroProduct, badge: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs"
                      />
                    </div>

                    <div className="sm:col-span-7">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                        Upload Product Photo (From Phone / Computer or Web URL) *
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <label className="h-10 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shrink-0">
                          <Upload className="w-4 h-4" />
                          <span>Upload Photo...</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAstroProductImageFileUpload}
                            className="hidden"
                          />
                        </label>

                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Or paste web image URL (https://...)"
                            value={editingAstroProduct.image || ''}
                            onChange={(e) => setEditingAstroProduct({ ...editingAstroProduct, image: e.target.value })}
                            className="w-full h-10 px-3.5 pr-8 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white text-xs font-mono"
                          />
                          <ImageIcon className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                      </div>

                      {/* Live Image Preview Box */}
                      {editingAstroProduct.image && (
                        <div className="mt-2.5 p-2 rounded-xl bg-[#0b132b] border border-[#3a506b] flex items-center gap-3">
                          <img
                            src={editingAstroProduct.image}
                            alt="Product Preview"
                            className="w-12 h-12 object-cover rounded-lg border border-[#3a506b] shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div>
                            <span className="text-[10px] font-bold text-[#fbbf24] block uppercase">Live Photo Preview</span>
                            <span className="text-[9px] text-gray-400 block line-clamp-1">Photo ready for submission</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#3a506b]">
                    <button
                      type="button"
                      onClick={() => setEditingAstroProduct(null)}
                      className="px-4 py-2 rounded-xl bg-[#0b132b] text-gray-300 font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md"
                    >
                      Submit for Admin Approval →
                    </button>
                  </div>
                </form>
              )}

              {/* PRODUCTS CATALOG TABLE */}
              <div className="bg-[#1c2541] rounded-3xl border border-[#3a506b] shadow-xl overflow-hidden">
                <div className="p-6 border-b border-[#3a506b] flex justify-between items-center">
                  <h4 className="font-serif font-bold text-xl text-[#faf8f4]">My Submitted Products</h4>
                  <span className="text-xs text-gray-400 font-mono">Total Items: {myProducts.length}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0b132b] border-b border-[#3a506b] text-[#fbbf24] font-serif uppercase tracking-wider">
                        <th className="p-4">Product Info</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Selling Price</th>
                        <th className="p-4">Net Astrologer Payout</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Admin Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3a506b]/50">
                      {myProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-400 font-medium">
                            No products submitted yet. Click "+ Submit New Product" above to list your consecrated items.
                          </td>
                        </tr>
                      ) : (
                        myProducts.map((p) => {
                          const commPct = p.adminCommissionPct ?? 15;
                          const netPayout = Math.round((p.price * (100 - commPct)) / 100);
                          return (
                            <tr key={p.id} className="hover:bg-[#0b132b]/40 transition-colors">
                              <td className="p-4">
                                <div className="font-extrabold text-white text-sm">{p.title}</div>
                                <div className="text-amber-300 text-[10px] font-mono">{p.badge}</div>
                              </td>
                              <td className="p-4 text-slate-300 font-medium">{p.category}</td>
                              <td className="p-4 font-mono font-bold text-[#fbbf24]">₹{p.price.toLocaleString()}</td>
                              <td className="p-4">
                                <span className="font-mono font-extrabold text-emerald-400">₹{netPayout.toLocaleString()}</span>
                                <span className="text-gray-400 text-[10px] block font-mono">({commPct}% Admin Fee deducted)</span>
                              </td>
                              <td className="p-4 font-mono font-bold text-gray-300">{p.stock} units</td>
                              <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                                  p.status === 'APPROVED'
                                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                    : p.status === 'REJECTED'
                                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                }`}>
                                  {p.status === 'APPROVED' ? '✅ Approved & Live' : p.status === 'REJECTED' ? '❌ Rejected' : '⏳ Awaiting Admin Approval'}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => setEditingAstroProduct(p)}
                                  className="px-3 py-1.5 rounded-xl bg-[#0b132b] hover:bg-[#334155] text-[#fbbf24] border border-[#3a506b] font-bold text-xs flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>Edit</span>
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
            </div>
          )}

          {/* TAB 1C: ASTROLOGER SELLER SALES & ORDERS */}
          {activeTab === 'astro_orders' && (
            <div className="space-y-6">
              <div className="bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] shadow-xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbbf24]/20 text-[#fbbf24] text-xs font-extrabold uppercase border border-[#fbbf24]/30">
                  <Tag className="w-3.5 h-3.5" />
                  Seller Sales & Client Purchases
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#faf8f4]">
                  Orders Received for Your Products
                </h3>
                <p className="text-xs text-gray-400">
                  Track orders placed by buyers for your submitted items. Admin confirms payments and credits net payouts directly to your wallet.
                </p>
              </div>

              <div className="bg-[#1c2541] rounded-3xl border border-[#3a506b] shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0b132b] border-b border-[#3a506b] text-[#fbbf24] font-serif uppercase tracking-wider">
                        <th className="p-4">Order Ref</th>
                        <th className="p-4">Buyer Contact</th>
                        <th className="p-4">Items Sold</th>
                        <th className="p-4">Client Paid</th>
                        <th className="p-4">Admin Commission</th>
                        <th className="p-4">My Net Payout</th>
                        <th className="p-4">Admin Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3a506b]/50">
                      {myShopOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-400 font-medium">
                            No seller orders placed yet for your items.
                          </td>
                        </tr>
                      ) : (
                        myShopOrders.map((ord) => {
                          const astroItems = ord.items.filter((it: any) => it.sellerId === 'astro-1' || it.sellerName?.includes('Acharya Tombi'));
                          const totalClientPrice = astroItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
                          const totalComm = astroItems.reduce((s: number, i: any) => s + (i.adminCommissionAmount || 0), 0);
                          const totalNet = totalClientPrice - totalComm;

                          return (
                            <tr key={ord.id} className="hover:bg-[#0b132b]/40 transition-colors">
                              <td className="p-4 font-mono font-bold text-[#fbbf24]">{ord.orderRef}</td>
                              <td className="p-4">
                                <div className="font-extrabold text-white">{ord.buyerName}</div>
                                <div className="text-amber-300 font-mono text-[10px]">{ord.whatsappNo || ord.mobile}</div>
                              </td>
                              <td className="p-4">
                                {astroItems.map((it: any, idx: number) => (
                                  <div key={idx} className="text-slate-200 font-medium">
                                    • {it.title} <span className="text-[#fbbf24]">x{it.quantity}</span>
                                  </div>
                                ))}
                              </td>
                              <td className="p-4 font-mono font-bold text-white">₹{totalClientPrice.toLocaleString()}</td>
                              <td className="p-4 font-mono text-amber-300">₹{totalComm.toLocaleString()}</td>
                              <td className="p-4 font-mono font-extrabold text-emerald-400">₹{totalNet.toLocaleString()}</td>
                              <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                                  ord.adminConfirmed
                                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                }`}>
                                  {ord.adminConfirmed ? '✅ Confirmed by Admin' : '⏳ Awaiting Admin Confirmation'}
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

          {/* TAB 6: ASTROLOGICAL CALCULATORS SUITE (ASTROLOGER WORKSPACE) */}
          {activeTab === 'tools' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className={`p-6 rounded-3xl border flex flex-wrap justify-between items-center gap-4 shadow-xl transition-colors ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase mb-2 border ${
                    theme === 'dark' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                    Empaneled Astrologer Workspace Suite
                  </div>
                  <h3 className={`font-serif font-bold text-2xl ${theme === 'dark' ? 'text-[#faf8f4]' : 'text-slate-900'}`}>
                    Astrological Calculators & Dosha Engine
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                    Access your Admin-permitted calculation tools to analyze client birth charts, Vimshottari Dashas, Kaal Sarp Dosh, and Lo Shu Grid.
                  </p>
                </div>

                <div className={`px-4 py-2 rounded-xl border text-xs font-bold font-mono ${
                  theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {ACTIVE_TOOLS_REGISTRY.filter((t) => allowedTools.includes(t.id)).length} Active Tools
                </div>
              </div>

              {/* Tools Grid or Empty State */}
              {ACTIVE_TOOLS_REGISTRY.filter((t) => allowedTools.includes(t.id)).length === 0 ? (
                <div className={`p-12 rounded-3xl border text-center space-y-4 shadow-xl transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-[#fbbf24]' : 'bg-amber-50 border-amber-200 text-amber-600'
                  }`}>
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h4 className={`font-serif font-bold text-2xl ${theme === 'dark' ? 'text-[#faf8f4]' : 'text-slate-900'}`}>No Astrological Tools Active Yet</h4>
                  <p className={`text-xs max-w-md mx-auto leading-relaxed font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                    We will add calculators one by one. Once a tool is added to the system and granted by the Admin in the Admin Panel, it will appear here in your workspace.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ACTIVE_TOOLS_REGISTRY.filter((t) => allowedTools.includes(t.id)).map((t) => (
                    <div
                      key={t.id}
                      className={`rounded-3xl p-6 border shadow-md transition-all flex flex-col justify-between space-y-4 ${
                        theme === 'dark'
                          ? 'bg-[#1c2541] border-[#3a506b] hover:border-[#fbbf24]'
                          : 'bg-white border-slate-200 hover:border-amber-500 shadow-sm text-slate-900'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
                          theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-[#fbbf24]' : 'bg-amber-50 border-amber-200 text-amber-600'
                        }`}>
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className={`font-serif font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.title}</h4>
                          <p className={`text-xs leading-relaxed font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>{t.subtitle}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActiveToolModal(t);
                          setCalcResult(null);
                        }}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Calculate Now</span>
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ========================== INSPECT CLIENT DETAILS MODAL ========================== */}
      {inspectingClient && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs transition-colors ${
          theme === 'dark' ? 'bg-[#0b132b]/80' : 'bg-slate-900/60'
        }`}>
          <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden relative text-left font-sans transition-colors ${
            theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Modal Header */}
            <div className={`p-6 flex items-center justify-between border-b ${
              theme === 'dark' ? 'bg-[#0f172a] border-[#3a506b] text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d97706] text-white flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-serif font-bold text-lg ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-800'}`}>Client Submission & Kuthi Profile</h3>
                  <p className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Ref ID: {inspectingClient.id}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingClient(null)}
                className={`p-2 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Kuthi File Attachment Box */}
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}>
                <div>
                  <span className={`font-bold text-xs uppercase tracking-wider block ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-800'}`}>Attached Physical Kuthi File</span>
                  <strong className={`text-sm block mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {inspectingClient.clientDetails.kuthiAttached ? inspectingClient.clientDetails.kuthiFileName : 'No Physical Paper Uploaded (Use Birth Details Below)'}
                  </strong>
                </div>

                {inspectingClient.clientDetails.kuthiAttached ? (
                  <a
                    href={inspectingClient.clientDetails.kuthiFileUrl || '/sample_kuthi.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-bold text-xs flex items-center gap-2 shadow-md shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Kuthi File</span>
                  </a>
                ) : (
                  <span className={`px-3 py-1.5 rounded-xl border font-bold text-xs ${
                    theme === 'dark' ? 'bg-[#1e293b] text-gray-300 border-[#3a506b]' : 'bg-slate-200 text-slate-800 border-slate-300'
                  }`}>
                    Birth Details Mode
                  </span>
                )}
              </div>

              {/* Complete Client Details */}
              <div className={`p-5 rounded-2xl border space-y-4 text-xs ${
                theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}>
                <div className={`flex items-center justify-between border-b pb-3 ${
                  theme === 'dark' ? 'border-[#3a506b]/60' : 'border-slate-200'
                }`}>
                  <div>
                    <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Client Name</span>
                    <strong className={`text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{inspectingClient.clientName} ({inspectingClient.clientDetails.sex})</strong>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>WhatsApp Contact</span>
                    <strong className={`text-sm font-mono ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-800'}`}>{inspectingClient.clientDetails.whatsappNo}</strong>
                  </div>
                </div>

                {inspectingClient.clientDetails.groomDetails || inspectingClient.clientDetails.brideDetails ? (
                  <div className="space-y-4">
                    {inspectingClient.clientDetails.groomDetails && (
                      <div className={`p-3 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                      }`}>
                        <span className={`text-xs font-bold block mb-1 ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-800'}`}>🤵 Groom Birth Details</span>
                        <div className={`grid grid-cols-2 gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                          <div>Name: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{inspectingClient.clientDetails.groomDetails.name}</strong></div>
                          <div>DOB: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{inspectingClient.clientDetails.groomDetails.dob}</strong></div>
                          <div>TOB: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{inspectingClient.clientDetails.groomDetails.tob}</strong></div>
                          <div>POB: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{inspectingClient.clientDetails.groomDetails.pob}</strong></div>
                        </div>
                      </div>
                    )}
                    {inspectingClient.clientDetails.brideDetails && (
                      <div className={`p-3 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                      }`}>
                        <span className="text-pink-600 text-xs font-bold block mb-1">👰 Bride Birth Details</span>
                        <div className={`grid grid-cols-2 gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                          <div>Name: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{inspectingClient.clientDetails.brideDetails.name}</strong></div>
                          <div>DOB: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{inspectingClient.clientDetails.brideDetails.dob}</strong></div>
                          <div>TOB: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{inspectingClient.clientDetails.brideDetails.tob}</strong></div>
                          <div>POB: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{inspectingClient.clientDetails.brideDetails.pob}</strong></div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Date of Birth</span>
                      <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{inspectingClient.clientDetails.dob || 'See Kuthi Document'}</strong>
                    </div>
                    <div>
                      <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Time of Birth</span>
                      <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{inspectingClient.clientDetails.tob || 'See Kuthi Document'}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Place of Birth</span>
                      <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{inspectingClient.clientDetails.pob || 'See Kuthi Document'}</strong>
                    </div>
                  </div>
                )}

                {inspectingClient.clientDetails.question && (
                  <div className={`pt-2 border-t ${theme === 'dark' ? 'border-[#3a506b]/40' : 'border-slate-200'}`}>
                    <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Client Question / Notes</span>
                    <p className={`font-mono text-[11px] mt-0.5 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>{inspectingClient.clientDetails.question}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => handleCopyClientDetails(inspectingClient)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-colors ${
                    theme === 'dark' ? 'bg-[#1e293b] hover:bg-[#334155] text-white border-[#3a506b]' : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                  }`}
                >
                  <Copy className="w-4 h-4 text-[#d97706]" />
                  <span>{copiedText ? '✓ Details Copied!' : 'Copy Summary Text'}</span>
                </button>

                <button
                  onClick={() => setInspectingClient(null)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-bold text-xs hover:opacity-95"
                >
                  Close Viewer
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================== REQUEST PAYOUT MODAL ========================== */}
      {showRequestPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className={`absolute inset-0 backdrop-blur-xs ${
            theme === 'dark' ? 'bg-black/70' : 'bg-slate-900/50'
          }`} onClick={() => setShowRequestPayoutModal(false)} />
          <div className={`relative w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 z-10 text-xs transition-colors ${
            theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex justify-between items-center pb-3 border-b ${
              theme === 'dark' ? 'border-[#3a506b]' : 'border-slate-200'
            }`}>
              <div>
                <h4 className={`font-serif font-bold text-lg flex items-center gap-2 ${
                  theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-800'
                }`}>
                  <Send className="w-5 h-5 text-green-600" />
                  Request Payout Disbursement
                </h4>
                <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Submit payout request to Admin for UPI / Bank Transfer</p>
              </div>
              <button onClick={() => setShowRequestPayoutModal(false)} className={`p-1 transition-colors ${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {payoutMsg && (
              <div className={`p-3 rounded-xl border text-xs font-bold text-center ${
                payoutMsg.startsWith('✅') ? 'bg-green-500/10 border-green-500/30 text-green-700' : 'bg-red-500/10 border-red-500/30 text-red-700'
              }`}>
                {payoutMsg}
              </div>
            )}

            <form onSubmit={handleRequestPayoutSubmit} className="space-y-4 font-sans">
              <div className={`p-3 rounded-xl border flex justify-between items-center ${
                theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-bold'}>Available Wallet Balance:</span>
                <span className="font-mono font-bold text-base text-green-600">₹{wallet.pendingPayout.toLocaleString()}</span>
              </div>

              <div>
                <label className={`block font-bold mb-1 uppercase tracking-wider text-[10px] ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-800'
                }`}>
                  Request Amount (₹)<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={wallet.pendingPayout}
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(Number(e.target.value))}
                  className={`w-full p-3 rounded-xl font-mono font-bold text-sm focus:border-[#d97706] focus:outline-none ${
                    theme === 'dark' ? 'bg-[#0b132b] border border-[#3a506b] text-[#fbbf24]' : 'bg-white border border-slate-300 text-amber-900 shadow-xs'
                  }`}
                />
              </div>

              <div className={`flex justify-end gap-2 pt-2 border-t ${
                theme === 'dark' ? 'border-[#3a506b]' : 'border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setShowRequestPayoutModal(false)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs ${
                    theme === 'dark' ? 'bg-[#0b132b] text-gray-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingPayout}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  {loadingPayout ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Submit Request to Admin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================== UPLOAD REPORT MODAL ========================== */}
      {uploadingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setUploadingOrder(null)} />
          <div className="relative w-full max-w-lg bg-[#1c2541] rounded-2xl border border-[#3a506b] shadow-2xl p-6 space-y-4 z-10 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#3a506b]">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#fbbf24] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#d97706]" />
                  Upload Completed Consultation Report
                </h4>
                <p className="text-gray-400 text-[11px]">Client: <strong className="text-[#faf8f4]">{uploadingOrder.clientName}</strong> ({uploadingOrder.id})</p>
              </div>
              <button onClick={() => setUploadingOrder(null)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadMsg && (
              <div className={`p-3 rounded-xl border text-xs font-bold text-center ${
                uploadMsg.startsWith('✅') ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}>
                {uploadMsg}
              </div>
            )}

            <form onSubmit={handleUploadReportSubmit} className="space-y-4 font-sans">
              {/* Native File Input for Computer & Mobile Phone */}
              <div>
                <label className="block text-gray-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Choose Report File From Device (Phone / Computer)<span className="text-red-400">*</span>
                </label>
                
                <input
                  type="file"
                  id="astrologer-report-file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="bg-[#0b132b] p-4 rounded-xl border border-green-500/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center shrink-0 font-bold">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white text-xs truncate">{selectedFile.name}</div>
                        <div className="text-[10px] text-green-400 mt-0.5 font-mono flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                          <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload</span>
                        </div>
                      </div>
                    </div>
                    <label
                      htmlFor="astrologer-report-file"
                      className="px-3 py-1.5 rounded-lg bg-[#1c2541] hover:bg-[#253356] border border-[#3a506b] text-amber-400 text-[11px] font-bold cursor-pointer shrink-0 transition-colors"
                    >
                      Change File
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="astrologer-report-file"
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#3a506b] hover:border-amber-400 bg-[#0b132b]/60 hover:bg-[#0b132b] rounded-2xl cursor-pointer transition-all text-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-white text-xs">Tap here to choose PDF report file from phone or computer</span>
                    <span className="text-[10px] text-gray-400 mt-1">Supports PDF documents (.pdf), Word (.docx), or JPG/PNG images</span>
                  </label>
                )}
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Report File Title / Document Name<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acharya_Sharma_Marriage_Report.pdf"
                  value={uploadForm.reportFileName}
                  onChange={(e) => setUploadForm({ ...uploadForm, reportFileName: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-semibold text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Astrologer Summary & Prescribed Remedies Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of planetary chart findings, Vimshottari Dasha analysis, gemstone advice, or special Vedic mantras..."
                  value={uploadForm.reportNotes}
                  onChange={(e) => setUploadForm({ ...uploadForm, reportNotes: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div className="bg-[#0b132b] p-3 rounded-xl border border-[#3a506b] flex justify-between items-center text-xs">
                <span className="text-gray-400">Commission Payout Credit:</span>
                <span className="font-mono font-bold text-green-400">+₹{uploadingOrder.payoutFee} to Wallet</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#3a506b]">
                <button
                  type="button"
                  onClick={() => setUploadingOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#0b132b] text-gray-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingUpload}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 hover:opacity-95"
                >
                  {loadingUpload ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                  <span>Publish & Deliver Report to Client</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================== INTERACTIVE ASTROLOGER TOOL MODAL ========================== */}
      {activeToolModal && (
        <div className="fixed inset-0 z-50 bg-[#0b132b]/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1c2541] w-full max-w-2xl rounded-3xl border border-[#3a506b] shadow-2xl overflow-hidden relative text-left font-sans text-white p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#3a506b] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#0b132b] border border-[#3a506b] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#fbbf24]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#fbbf24]">{activeToolModal.title}</h3>
                  <p className="text-xs text-gray-400">Astrologer Calculator • Run calculations for client</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setActiveToolModal(null); setCalcResult(null); }}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inputs Form */}
            {!calcResult && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsCalculating(true);
                  setTimeout(() => {
                    setIsCalculating(false);
                    const mType = activeToolModal.id || activeToolModal.type;

                    if (mType === 'kuthi-generator' || activeToolModal.id === 'kuthi-generator') {
                      const chartData = calculatePlanetaryPositions({
                        name: calcForm.name,
                        gender: calcForm.sex,
                        dateOfBirth: calcForm.dob,
                        timeOfBirth: calcForm.tob,
                        latitude: Number(calcForm.lat) || 24.8170,
                        longitude: Number(calcForm.lng) || 93.9368,
                        timezone: 'Asia/Kolkata',
                        utcOffset: Number(calcForm.timezone) || 5.5,
                        ayanamsa: 'Lahiri',
                      });

                      const ascSignIndex = Math.floor(chartData.ascendant / 30);
                      const ascSignDegree = chartData.ascendant % 30;
                      const ascNakshatra = getNakshatraInfo(chartData.ascendant);

                      // Ascendant Position Object
                      const ascendantItem = {
                        id: 'asc',
                        name: 'Ascendant / Lagna (লগ্ন)',
                        bengaliName: 'লগ্ন',
                        signIndex: ascSignIndex,
                        signName: BENGALI_RASHI_NAMES[ascSignIndex],
                        signDegree: ascSignDegree,
                        nakshatraIndex: ascNakshatra.index,
                        nakshatraName: ascNakshatra.name,
                        nakshatraPada: ascNakshatra.pada,
                        houseNumber: 1,
                        formattedString: formatBengaliPositionString('asc', ascNakshatra.index, ascSignIndex, ascSignDegree),
                      };

                      // D1 Rashi Chart Mapping (South Indian / Bengali Grid)
                      const d1MappedPlanets = chartData.planets.map((p: any) => ({
                        name: p.name,
                        abbr: BENGALI_PLANET_MAP[p.id]?.abbr || p.name.substring(0, 2),
                        houseNumber: p.signIndex + 1, // Sign cell 1-12
                        isRetrograde: p.isRetrograde,
                      }));

                      // D9 Navamsha Chart Mapping (South Indian / Bengali Grid)
                      const navPlanets = calculateAllNavamsha(chartData.planets);
                      const navAsc = calculateNavamsha(chartData.ascendant);
                      const d9MappedPlanets = navPlanets.map((p: any) => ({
                        name: p.name,
                        abbr: BENGALI_PLANET_MAP[p.id]?.abbr || p.name.substring(0, 2),
                        houseNumber: p.signIndex + 1, // Navamsha Sign cell 1-12
                        isRetrograde: p.isRetrograde,
                      }));

                      // Format all planets with Bengali string format
                      const formattedPlanets = chartData.planets.map((p: any) => {
                        const hNum = ((p.signIndex - ascSignIndex + 12) % 12) + 1;
                        return {
                          ...p,
                          bengaliName: BENGALI_PLANET_MAP[p.id]?.bengaliName || p.name,
                          bengaliRashiName: BENGALI_RASHI_NAMES[p.signIndex],
                          houseNumber: hNum,
                          formattedString: formatBengaliPositionString(p.id, p.nakshatraIndex, p.signIndex, p.signDegree),
                        };
                      });

                      // Calculate Sakabta, Bengali Solar Date, Panchanga & Dasha Balances
                      const sunObj = chartData.planets.find((p: any) => p.id === 'su') || chartData.planets[0];
                      const moonObj = chartData.planets.find((p: any) => p.id === 'mo') || chartData.planets[1];
                      const panchangaDetails = calculatePanchangaDetails(
                        calcForm.dob,
                        sunObj.signIndex * 30 + sunObj.signDegree,
                        moonObj.signIndex * 30 + moonObj.signDegree
                      );

                      setCalcResult({
                        isKuthiChart: true,
                        type: 'Kuthi Generator (Natal Birth Chart)',
                        name: calcForm.name,
                        sex: calcForm.sex,
                        dob: calcForm.dob,
                        tob: calcForm.tob,
                        pob: calcForm.pob,
                        ascendantItem,
                        ascSignIndex,
                        navAscSignIndex: navAsc.signIndex,
                        ascSign1to12: ascSignIndex + 1,
                        navAscSign1to12: navAsc.signIndex + 1,
                        planets: formattedPlanets,
                        d1MappedPlanets,
                        d9MappedPlanets,
                        panchangaDetails,
                      });
                      return;
                    }
                  }, 500);
                }}
                className="space-y-4 font-sans text-xs"
              >
                {activeToolModal.id === 'kuthi-generator' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={calcForm.name}
                          onChange={(e) => setCalcForm({ ...calcForm, name: e.target.value })}
                          className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-semibold focus:border-[#d97706] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                          Sex / Gender *
                        </label>
                        <select
                          value={calcForm.sex}
                          onChange={(e) => setCalcForm({ ...calcForm, sex: e.target.value })}
                          className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-amber-300 font-bold focus:border-[#d97706] focus:outline-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                          Date Of Birth *
                        </label>
                        <input
                          type="date"
                          required
                          value={calcForm.dob}
                          onChange={(e) => setCalcForm({ ...calcForm, dob: e.target.value })}
                          className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-semibold focus:border-[#d97706] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                          Time Of Birth *
                        </label>
                        <input
                          type="time"
                          required
                          value={calcForm.tob}
                          onChange={(e) => setCalcForm({ ...calcForm, tob: e.target.value })}
                          className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-semibold focus:border-[#d97706] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                        Place Of Birth (City / Town) *
                      </label>
                      <input
                        type="text"
                        required
                        value={calcForm.pob}
                        onChange={(e) => setCalcForm({ ...calcForm, pob: e.target.value })}
                        className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-semibold focus:border-[#d97706] focus:outline-none"
                        placeholder="e.g. Imphal, Manipur"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-[#e0a96d] mb-1">Latitude (°N)</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={calcForm.lat}
                          onChange={(e) => setCalcForm({ ...calcForm, lat: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl bg-[#0b132b] border border-[#3a506b] text-amber-300 font-mono text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-[#e0a96d] mb-1">Longitude (°E)</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={calcForm.lng}
                          onChange={(e) => setCalcForm({ ...calcForm, lng: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl bg-[#0b132b] border border-[#3a506b] text-amber-300 font-mono text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-[#e0a96d] mb-1">UTC Offset</label>
                        <input
                          type="number"
                          step="0.5"
                          value={calcForm.timezone}
                          onChange={(e) => setCalcForm({ ...calcForm, timezone: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl bg-[#0b132b] border border-[#3a506b] text-amber-300 font-mono text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-[#e0a96d] mb-1">Ayanamsa</label>
                        <input
                          type="text"
                          readOnly
                          value={calcForm.ayanamsa}
                          className="w-full p-2.5 rounded-xl bg-[#0b132b] border border-[#3a506b] text-gray-400 font-semibold text-[11px]"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={calcForm.name}
                      onChange={(e) => setCalcForm({ ...calcForm, name: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-semibold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isCalculating}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>{isCalculating ? 'Computing Planetary Ephemeris Math...' : `Generate ${activeToolModal.title}`}</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Results Output for Kuthi Generator (D1 & D9 Charts + Bengali Format) */}
            {calcResult && calcResult.isKuthiChart && (
              <div className="space-y-6 font-sans text-xs">
                {/* Header Banner */}
                <div className="bg-[#0b132b] p-5 rounded-2xl border border-[#3a506b] flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div>
                    <span className="px-3 py-0.5 rounded-full bg-[#fbbf24]/20 text-[#fbbf24] text-[10px] font-extrabold uppercase border border-[#fbbf24]/30">
                      NATAL KUTHI REPORT GENERATED
                    </span>
                    <h4 className="text-xl font-serif font-bold text-white pt-1">
                      {calcResult.name} ({calcResult.sex})
                    </h4>
                    <p className="text-xs text-gray-400">
                      DOB: {calcResult.dob} | TOB: {calcResult.tob} | POB: {calcResult.pob}
                    </p>
                  </div>
                  <div className="text-right bg-[#1c2541] px-4 py-2 rounded-xl border border-[#3a506b] space-y-1">
                    <span className="block text-[10px] text-gray-400 uppercase font-bold">Lagna Position Format</span>
                    <span className="font-serif font-bold text-amber-300 text-sm block">
                      {calcResult.ascendantItem.formattedString}
                    </span>
                    <span className="text-[11px] text-gray-300 block font-medium">
                      Rashi: {calcResult.ascendantItem.signName}
                    </span>
                  </div>
                </div>

                {/* SIDE-BY-SIDE D1 & D9 CHARTS (Bengali / Eastern Grid Style) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* D1 RASHI CHART */}
                  <div className="bg-[#0b132b] p-4 rounded-2xl border border-[#3a506b] space-y-3 text-center">
                    <div className="flex items-center justify-between border-b border-[#3a506b]/60 pb-2">
                      <h5 className="font-serif font-bold text-base text-[#fbbf24]">D1 Rashi Chart (Lagna)</h5>
                      <span className="text-[10px] font-extrabold text-amber-400/80 bg-amber-950/40 px-2 py-0.5 rounded-full">
                        Bengali Grid Style
                      </span>
                    </div>
                    <div className="flex justify-center pt-1">
                      <BengaliChart
                        planets={calcResult.d1MappedPlanets}
                        ascendantSign={calcResult.ascSignIndex}
                        title="D1 Rashi Chart (Lagna)"
                      />
                    </div>
                  </div>

                  {/* D9 NAVAMSHA CHART */}
                  <div className="bg-[#0b132b] p-4 rounded-2xl border border-[#3a506b] space-y-3 text-center">
                    <div className="flex items-center justify-between border-b border-[#3a506b]/60 pb-2">
                      <h5 className="font-serif font-bold text-base text-[#fbbf24]">D9 Navamsha Chart</h5>
                      <span className="text-[10px] font-extrabold text-purple-400/80 bg-purple-950/40 px-2 py-0.5 rounded-full">
                        Bengali Grid Style
                      </span>
                    </div>
                    <div className="flex justify-center pt-1">
                      <BengaliChart
                        planets={calcResult.d9MappedPlanets}
                        ascendantSign={calcResult.navAscSignIndex}
                        title="D9 Navamsha Chart"
                      />
                    </div>
                  </div>
                </div>

                {/* TRADITIONAL BENGALI PANCHANGA & SAKABTA DETAILS CARD */}
                {calcResult.panchangaDetails && (
                  <div className="bg-[#0b132b] p-5 rounded-2xl border border-[#3a506b] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#3a506b]/60 pb-2">
                      <h5 className="font-serif font-bold text-sm text-[#e0a96d] uppercase tracking-wider">
                        শকাব্দ ও বাংলা তারিখ এবং জন্ম পঞ্চাঙ্গ বিবরণ (Birth Panchanga & Era Details)
                      </h5>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#d97706]/20 text-[#fbbf24] text-[10px] font-bold">
                        {calcResult.panchangaDetails.sakabta}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-[#1c2541] p-3 rounded-xl border border-[#3a506b]/60">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">শকাব্দ (Sakabta Era)</span>
                        <span className="text-white font-bold text-sm pt-0.5 block">{calcResult.panchangaDetails.sakabta}</span>
                      </div>
                      <div className="bg-[#1c2541] p-3 rounded-xl border border-[#3a506b]/60">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">বাংলা তারিখ (Bengali Date)</span>
                        <span className="text-amber-300 font-bold text-xs pt-0.5 block">{calcResult.panchangaDetails.bengaliDateStr}</span>
                      </div>
                      <div className="bg-[#1c2541] p-3 rounded-xl border border-[#3a506b]/60">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">জন্ম তিথি (Tithi)</span>
                        <span className="text-white font-bold text-xs pt-0.5 block">{calcResult.panchangaDetails.tithiName}</span>
                      </div>
                      <div className="bg-[#1c2541] p-3 rounded-xl border border-[#3a506b]/60">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">জন্ম যোগ (Yoga)</span>
                        <span className="text-white font-bold text-xs pt-0.5 block">{calcResult.panchangaDetails.yogaName}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs pt-1">
                      <div className="bg-[#1c2541]/70 p-2.5 rounded-xl border border-[#3a506b]/40">
                        <span className="block text-[9px] text-gray-400 font-bold uppercase">করণ (Karana)</span>
                        <span className="text-gray-200 font-semibold">{calcResult.panchangaDetails.karanaName}</span>
                      </div>
                      <div className="bg-[#1c2541]/70 p-2.5 rounded-xl border border-[#3a506b]/40">
                        <span className="block text-[9px] text-gray-400 font-bold uppercase">গণ (Gana)</span>
                        <span className="text-gray-200 font-semibold">{calcResult.panchangaDetails.gana}</span>
                      </div>
                      <div className="bg-[#1c2541]/70 p-2.5 rounded-xl border border-[#3a506b]/40">
                        <span className="block text-[9px] text-gray-400 font-bold uppercase">যোনি (Yoni)</span>
                        <span className="text-gray-200 font-semibold">{calcResult.panchangaDetails.yoni}</span>
                      </div>
                      <div className="bg-[#1c2541]/70 p-2.5 rounded-xl border border-[#3a506b]/40">
                        <span className="block text-[9px] text-gray-400 font-bold uppercase">নাড়ি (Nadi)</span>
                        <span className="text-gray-200 font-semibold">{calcResult.panchangaDetails.nadi}</span>
                      </div>
                      <div className="bg-[#1c2541]/70 p-2.5 rounded-xl border border-[#3a506b]/40">
                        <span className="block text-[9px] text-gray-400 font-bold uppercase">বর্ণ ও বশ্য</span>
                        <span className="text-gray-200 font-semibold">{calcResult.panchangaDetails.varna} / {calcResult.panchangaDetails.vashya}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* DASHA BALANCES AT BIRTH CARD (VIMSHOTTARI, ASHTOTTARI, YOGINI) */}
                {calcResult.panchangaDetails && (
                  <div className="bg-[#0b132b] p-5 rounded-2xl border border-[#3a506b] space-y-3">
                    <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#fbbf24] block">
                      Balance Of Dasha
                    </span>

                    <div className="space-y-2.5 text-xs">
                      {/* Vimshottari Dasha Balance */}
                      <div className="p-3.5 rounded-xl bg-[#1c2541] border border-amber-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
                            বিংশোত্তরী দশা
                          </span>
                          <span className="font-bold text-white text-xs">
                            {calcResult.panchangaDetails.vimshottariDasha.lordBengali} ({calcResult.panchangaDetails.vimshottariDasha.lordName})
                          </span>
                        </div>
                        <span className="font-mono font-bold text-amber-300 text-sm tracking-wide">
                          {calcResult.panchangaDetails.vimshottariDasha.formattedString}
                        </span>
                      </div>

                      {/* Ashtottari Dasha Balance */}
                      <div className="p-3.5 rounded-xl bg-[#1c2541] border border-purple-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase">
                            অষ্টোত্তরী দশা
                          </span>
                          <span className="font-bold text-white text-xs">
                            {calcResult.panchangaDetails.ashtottariDasha.lordBengali} ({calcResult.panchangaDetails.ashtottariDasha.lordName})
                          </span>
                        </div>
                        <span className="font-mono font-bold text-purple-300 text-sm tracking-wide">
                          {calcResult.panchangaDetails.ashtottariDasha.formattedString}
                        </span>
                      </div>

                      {/* Yogini Dasha Balance */}
                      <div className="p-3.5 rounded-xl bg-[#1c2541] border border-teal-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase">
                            যোগিনী দশা
                          </span>
                          <span className="font-bold text-white text-xs">
                            {calcResult.panchangaDetails.yoginiDasha.nameBengali} ({calcResult.panchangaDetails.yoginiDasha.name})
                          </span>
                        </div>
                        <span className="font-mono font-bold text-teal-300 text-sm tracking-wide">
                          {calcResult.panchangaDetails.yoginiDasha.formattedString}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* PLANETARY LONGITUDES & POSITIONS TABLE (Format: রবি (১২) ০।১২।২৩।১২) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase text-[#e0a96d]">
                      Planetary Longitudes & Positions (Format: গ্রহ (নক্ষত্র) রাশি।ডিগ্রী।মিনিট।সেকেন্ড)
                    </span>
                  </div>
                  <div className="border border-[#3a506b] rounded-2xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-[#0b132b] text-[#e0a96d] uppercase font-bold text-[10px]">
                        <tr>
                          <th className="p-2.5">Planet</th>
                          <th className="p-2.5">Position Format (গ্রহ (নক্ষত্র) রাশি।ডিগ্রী।মিনিট।সেকেন্ড)</th>
                          <th className="p-2.5">Rashi Sign (0-11)</th>
                          <th className="p-2.5">Nakshatra & Pada</th>
                          <th className="p-2.5">House</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3a506b]/40">
                        {/* ASCENDANT (LAGNA) ROW */}
                        <tr className="bg-amber-950/30 font-bold border-b border-[#3a506b]">
                          <td className="p-2.5 text-amber-300 flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                            <span>{calcResult.ascendantItem.name}</span>
                          </td>
                          <td className="p-2.5 text-amber-300 font-mono font-bold">
                            {calcResult.ascendantItem.formattedString}
                          </td>
                          <td className="p-2.5 text-gray-200">{calcResult.ascendantItem.signName}</td>
                          <td className="p-2.5 text-gray-300">
                            {calcResult.ascendantItem.nakshatraName} (Pada {calcResult.ascendantItem.nakshatraPada})
                          </td>
                          <td className="p-2.5 text-amber-300 font-extrabold">House 1 (Lagna)</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/30">
                              Lagna Point
                            </span>
                          </td>
                        </tr>

                        {/* 9 PLANETS ROWS */}
                        {calcResult.planets.map((p: any) => (
                          <tr key={p.id} className="hover:bg-[#0b132b]/40">
                            <td className="p-2.5 font-bold text-white flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                              <span>{p.bengaliName} ({p.name})</span>
                            </td>
                            <td className="p-2.5 text-amber-300 font-mono font-bold">
                              {p.formattedString}
                            </td>
                            <td className="p-2.5 text-gray-200">{p.bengaliRashiName}</td>
                            <td className="p-2.5 text-gray-300">
                              {p.nakshatraName} (Pada {p.nakshatraPada})
                            </td>
                            <td className="p-2.5 font-bold text-gray-200">House {p.houseNumber}</td>
                            <td className="p-2.5">
                              {p.isRetrograde ? (
                                <span className="px-2 py-0.5 rounded-full bg-red-950/60 text-red-400 text-[10px] font-extrabold border border-red-500/30">
                                  Retrograde (ব / R)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-green-950/60 text-green-400 text-[10px] font-extrabold border border-green-500/30">
                                  Direct (D)
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Print / Save Kuthi Chart PDF</span>
                  </button>
                  <button
                    onClick={() => setCalcResult(null)}
                    className="py-3 px-5 rounded-xl bg-[#0b132b] hover:bg-[#334155] text-gray-300 font-bold text-xs border border-[#3a506b] cursor-pointer"
                  >
                    Calculate Another Kuthi
                  </button>
                </div>
              </div>
            )}

            {/* Default Generic Results Output */}
            {calcResult && !calcResult.isKuthiChart && (
              <div className="space-y-5 font-sans text-xs">
                <div className="bg-[#0b132b] p-5 rounded-2xl border border-[#3a506b] text-center space-y-1">
                  <span className="px-3 py-0.5 rounded-full bg-[#fbbf24]/20 text-[#fbbf24] text-[10px] font-extrabold border border-[#fbbf24]/30">
                    REPORT: {calcResult.type}
                  </span>
                  <h4 className="text-xl font-serif font-bold text-white pt-1">{calcResult.type}</h4>
                </div>
                <button
                  onClick={() => setCalcResult(null)}
                  className="w-full py-3 rounded-xl bg-[#0b132b] hover:bg-[#334155] text-gray-300 font-bold text-xs border border-[#3a506b] cursor-pointer"
                >
                  Calculate Another Profile
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ASTROLOGER CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-[#0b132b]/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1c2541] rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#3a506b] shadow-2xl text-left font-sans text-white">
            <div className="flex justify-between items-center pb-3 border-b border-[#3a506b]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#d97706] text-white flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#fbbf24]">Update Portal Password</h3>
                  <p className="text-xs text-gray-400">Change your Astrologer Login Passcode</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pwdError && (
              <div className="p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-300 text-xs font-bold">
                ⚠️ {pwdError}
              </div>
            )}

            {pwdMsg && (
              <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-300 text-xs font-bold">
                {pwdMsg}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-[#e0a96d] uppercase mb-1">
                  Current Password / Passcode *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-mono text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#e0a96d] uppercase mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 4 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-mono text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#e0a96d] uppercase mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-mono text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#3a506b]">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0b132b] text-gray-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  {pwdLoading ? 'Saving...' : 'Update Password →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
