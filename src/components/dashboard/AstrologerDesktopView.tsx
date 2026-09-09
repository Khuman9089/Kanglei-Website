'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Moon, LayoutDashboard, FileText, Users, Settings, 
  Search, Bell, CheckCircle2, XCircle, ArrowUpRight, 
  ArrowDownLeft, ArrowLeft, MessageSquare, ShieldCheck, Lock, TrendingUp, 
  BarChart2, Calendar, Clock, LogOut, Check, ChevronDown, Menu,
  DollarSign, Filter, Share2, Award, Eye, Download, Copy, X, Sparkles, Save, Tag,
  Wallet, RefreshCw, Send, UploadCloud, Upload, User, Phone, Mail, MapPin, Paperclip,
  CheckCircle, AlertCircle, Edit, Star, Heart, Baby, FileCheck, KeyRound,
  Hash, Sun, Flame, Disc, Compass, Car, Grid, Globe, ShoppingBag, Plus, Image as ImageIcon,
  ScrollText, Printer
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
import { calculateYumsharol, NAKSHATRAS_LIST, YUMSHAROL_REMAINDER_PREDICTIONS } from '@/lib/astrology/yumsharol';
import { calculateNgaEeshing, RASHI_LIST_NGA_EESHING } from '@/lib/astrology/ngaEeshing';
import { calculateSadeSati } from '@/lib/astrology/sadeSati';
import { calculateManglikDosh } from '@/lib/astrology/manglik';
import { calculateKaalSarpDosh } from '@/lib/astrology/kaalSarp';
import { calculateCoupleMatch } from '@/lib/astrology/matchMaking';
import { calculatePlanetaryYogas } from '@/lib/astrology/yogas';
import LiveConsultationRoom from '@/components/consultation/LiveConsultationRoom';
import VedicWorkstation from '@/components/dashboard/VedicWorkstation';

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
  uploadedFiles?: string[];
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
  faithTradition?: string;
  gotra?: string;
  yek?: string;
  utr: string;
  amount: number;
}

interface Order {
  id: string;
  orderRef?: string;
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
  const [astroUsernameInput, setAstroUsernameInput] = useState('');
  const [astroPasscodeInput, setAstroPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Guru Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    specialty: '',
    experience: '',
    pricePerMin: 0,
    avatar: '',
    specialtiesStr: '',
    languages: '',
    phone: '',
    whatsappNo: '',
    email: '',
    bio: '',
    maxDailyOrders: 5,
    morningSlot: true,
    afternoonSlot: true,
    eveningSlot: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserStr = localStorage.getItem('kanglei_user');
      if (savedUserStr) {
        try {
          const u = JSON.parse(savedUserStr);
          if (u && u.role === 'ASTROLOGER' && u.name) {
            setIsAuthenticated(true);
            setProfileForm((prev) => ({
              ...prev,
              name: u.name || '',
              phone: u.phone || '',
              whatsappNo: u.whatsappNo || '',
              email: u.email || '',
              specialty: u.specialty || '',
              avatar: u.avatar || '',
            }));
            return;
          }
        } catch (e) {}
      }
      // If no valid registered astrologer session exists, clear and require login
      localStorage.removeItem('kanglei_astro_authed');
      setIsAuthenticated(false);
    }
  }, []);

  const handleAstroLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const inputUser = astroUsernameInput.trim();
    const inputPwd = astroPasscodeInput.trim();

    if (!inputUser || !inputPwd || inputPwd.length < 4) {
      setAuthError('❌ Please enter your registered Astrologer Username/Phone and Password.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: inputUser,
          password: inputPwd,
          role: 'ASTROLOGER',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || '❌ Access Denied: Incorrect Username or Password!');
        return;
      }

      localStorage.setItem('kanglei_astro_authed', 'true');
      if (data.user) {
        localStorage.setItem('kanglei_user', JSON.stringify(data.user));
        setProfileForm((prev) => ({
          ...prev,
          name: data.user.name || '',
          phone: data.user.phone || '',
          whatsappNo: data.user.whatsappNo || '',
          email: data.user.email || '',
          specialty: data.user.specialty || '',
          avatar: data.user.avatar || '',
        }));
      }
      setIsAuthenticated(true);
      setAstroUsernameInput('');
      setAstroPasscodeInput('');
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    }
  };

  const handleAstroLogout = () => {
    localStorage.removeItem('kanglei_astro_authed');
    localStorage.removeItem('kanglei_user');
    setIsAuthenticated(false);
    setProfileForm({
      name: '',
      specialty: '',
      experience: '',
      pricePerMin: 0,
      avatar: '',
      specialtiesStr: '',
      languages: '',
      phone: '',
      whatsappNo: '',
      email: '',
      bio: '',
      maxDailyOrders: 5,
      morningSlot: true,
      afternoonSlot: true,
      eveningSlot: false,
    });
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

  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'wallet' | 'tools' | 'schedule' | 'profile' | 'astro_products' | 'astro_orders' | 'astro_returns' | 'live_consultation'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saveAlert, setSaveAlert] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Live Consultation In-App Call/Chat State
  const [incomingSession, setIncomingSession] = useState<any>(null);
  const [activeLiveSessionId, setActiveLiveSessionId] = useState<string | null>(null);
  const [desktopConsultations, setDesktopConsultations] = useState<any[]>([]);

  useEffect(() => {
    const pollConsultations = async () => {
      try {
        const res = await fetch('/api/consultations');
        const data = await res.json();
        if (data.sessions && Array.isArray(data.sessions)) {
          const mySessions = data.sessions.filter((s: any) => {
            return (
              !s.astrologerId ||
              s.astrologerId === 'astro-1' ||
              (s.astrologerName && profileForm.name && s.astrologerName.toLowerCase().includes(profileForm.name.toLowerCase()))
            );
          });
          setDesktopConsultations(mySessions);

          const waiting = mySessions.find((s: any) => {
            if (s.status !== 'WAITING') return false;
            if (!s.meetingLinkSent) return false; // ONLY available if link sent by admin!
            const sessionTime = new Date(s.createdAt).getTime();
            const age = Date.now() - sessionTime;
            return !isNaN(age) && age >= 0 && age < 2 * 60 * 1000;
          });

          if (waiting) {
            setIncomingSession(waiting);
          } else {
            setIncomingSession(null);
          }

          // NEVER auto-open activeLiveSessionId so it does not hijack view
        }
      } catch (err) {
        console.warn('Consultation polling note:', err);
      }
    };
    pollConsultations();
    const timer = setInterval(pollConsultations, 3000);
    return () => clearInterval(timer);
  }, [activeLiveSessionId, profileForm.name]);

  const handleAcceptIncomingConsultation = async (sessionId: string) => {
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ACCEPT_SESSION', sessionId }),
      });
      const data = await res.json();
      if (data.session) {
        setActiveLiveSessionId(data.session.id);
        setIncomingSession(null);
        setActiveTab('live_consultation');
      }
    } catch (err) {
      console.error('Failed to accept consultation:', err);
    }
  };

  // Astrologer Vendor Store State
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [myShopOrders, setMyShopOrders] = useState<any[]>([]);
  const [editingAstroProduct, setEditingAstroProduct] = useState<any>(null);
  const [shopCategories, setShopCategories] = useState<string[]>(['Gemstones', 'Astrology Books', 'Yantras & Mala', 'Puja Items', 'Consecrated Remedies']);

  // Astrologer Returns & Replacements State
  const [astroReturns, setAstroReturns] = useState<any[]>([]);
  const [returnStatusFilter, setReturnStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED_REPLACEMENT' | 'APPROVED_REFUND' | 'REJECTED' | 'RESOLVED'>('ALL');
  const [selectedReturnDetail, setSelectedReturnDetail] = useState<any | null>(null);
  const [loadingReturns, setLoadingReturns] = useState<boolean>(false);

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
    partnerDob: '1997-08-20',
    partnerTob: '10:30',
    partnerPob: 'Imphal, Manipur',
    partnerLat: 24.8170,
    partnerLng: 93.9368,
    timezone: 5.5,
    ayanamsa: 'Lahiri (Chitrapaksha)',
    vehicleNo: 'MN01AB1234',
    nakshatra: 1,
    constantValue: 15,
    groomRashi: 0,
    brideRashi: 0,
  });
  const [yumsharolValidationErr, setYumsharolValidationErr] = useState('');
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
    pendingPayout: 0,
    totalPaidOut: 0,
    totalEarnings: 0,
    lastUpdated: new Date().toISOString().split('T')[0],
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  // Active Orders State
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch live wallet data from /api/astrologers/payout
  const fetchWallet = () => {
    fetch('/api/astrologers/payout?astroId=astro-1&t=' + Date.now(), { cache: 'no-store' })
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
          const myAstro = data.astrologers.find((a: any) => (profileForm.phone && a.phone === profileForm.phone) || (profileForm.name && a.name === profileForm.name));
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
          const assigned = data.orders.filter((o: any) => (profileForm.name && o.assignedAstrologerName?.includes(profileForm.name)) || (profileForm.phone && o.assignedAstrologerId === profileForm.phone));
          const mapped: Order[] = assigned.map((o: any) => ({
            id: o.id || o.orderRef,
            orderRef: o.orderRef || o.id,
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
              uploadedFiles: o.uploadedFiles || (o.kuthiFileName ? [o.kuthiFileName] : []),
              groomDetails: o.groomDetails,
              brideDetails: o.brideDetails,
              question: o.question,
              faithTradition: o.faithTradition || (o.gotra ? 'Hinduism' : o.yek ? 'Sanamahi Laining' : 'Hinduism'),
              gotra: o.gotra || '',
              yek: o.yek || '',
              utr: o.utr || '429810441920',
              amount: o.amount || 499,
            },
          }));
          setOrders(mapped);
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
            (p: any) => (profileForm.name && p.sellerName === profileForm.name) || (profileForm.phone && p.sellerId === profileForm.phone)
          );
          setMyProducts(mine);
        }
        if (data.orders && Array.isArray(data.orders)) {
          const mineOrders = data.orders.filter((o: any) =>
            o.items.some((it: any) => (profileForm.name && it.sellerName === profileForm.name) || (profileForm.phone && it.sellerId === profileForm.phone))
          );
          setMyShopOrders(mineOrders);
        }
        if (data.categories) setShopCategories(data.categories);
      })
      .catch((err) => console.error('Error fetching astrologer shop data:', err));
  };

  const INITIAL_ASTRO_RETURNS: any[] = [];

  const fetchAstroReturns = () => {
    setLoadingReturns(true);
    fetch('/api/shop/returns')
      .then((res) => res.json())
      .then((data) => {
        if (data.returns && Array.isArray(data.returns)) {
          setAstroReturns(data.returns);
        } else {
          setAstroReturns([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching astrologer returns:', err);
        setAstroReturns([]);
      })
      .finally(() => setLoadingReturns(false));
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
        sku: editingAstroProduct.sku || ('SKU-AST-' + Math.floor(10000 + Math.random() * 90000)),
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
        sellerId: profileForm.phone || 'astro-seller',
        sellerName: profileForm.name || 'Empaneled Astrologer',
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
    fetchAstroReturns();
    fetch('/api/announcements')
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements && Array.isArray(data.announcements)) {
          setAnnouncements(data.announcements.filter((a: any) => a.isActive));
        }
      })
      .catch((err) => console.error('Error fetching announcements:', err));

    const pollTimer = setInterval(() => {
      fetchOrders();
      fetchWallet();
      fetchAstroReturns();
    }, 4000);
    return () => clearInterval(pollTimer);
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
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target?.result as string;
        setUploadForm((prev) => ({
          ...prev,
          reportFileName: file.name,
          reportFileUrl: dataUrl || '/sample_kuthi.pdf',
        }));
      };
      reader.readAsDataURL(file);
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
          reportFileName: uploadForm.reportFileName || 'consultation_report.pdf',
          reportFileUrl: uploadForm.reportFileUrl || '/sample_kuthi.pdf',
          reportNotes: uploadForm.reportNotes || '',
          uploadedBy: profileForm.name || 'Empaneled Astrologer',
        }),
      });

      const resData = await res.json().catch(() => ({}));

      if (!res.ok) {
        setUploadMsg(`❌ Error: ${resData.error || 'Failed to upload report. Please try again.'}`);
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
          orderRef: uploadingOrder.orderRef || uploadingOrder.id,
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
    } catch (err: any) {
      console.error(err);
      setLoadingUpload(false);
      setUploadMsg(`❌ Error uploading report: ${err.message || 'Network failure'}`);
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
      fetchWallet();
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
Contact: [Protected for Privacy]
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
              Please enter your registered astrologer passcode to access assigned Kuthi consultations & professional tools.
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
                Username / Registered Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="Enter username or +91 98620 00000"
                value={astroUsernameInput}
                onChange={(e) => setAstroUsernameInput(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-[#3a506b] bg-slate-50 dark:bg-[#0b132b] text-slate-900 dark:text-white font-bold text-xs focus:border-[#d97706] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1.5">
                Portal Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Enter portal password"
                value={astroPasscodeInput}
                onChange={(e) => setAstroPasscodeInput(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-[#3a506b] bg-slate-50 dark:bg-[#0b132b] text-slate-900 dark:text-white font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
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
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans flex flex-col md:flex-row transition-colors duration-300 ${
      theme === 'dark' ? 'dark bg-[#0b132b] text-[#faf8f4]' : 'bg-[#faf8f5] text-[#0f172a]'
    }`}>
      
      {/* ─────────────────────────────────────────────────────────────
         1. LEFT NAVIGATION SIDEBAR (Admin Portal Style)
         ───────────────────────────────────────────────────────────── */}
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-35 md:hidden cursor-pointer"
        />
      )}
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
                  kuthiyengpham
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
                  onClick={() => { setActiveTab('live_consultation'); setSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'live_consultation'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-extrabold'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span>Live Chat & Call Room</span>
                  </div>
                  {activeLiveSessionId ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold animate-pulse">
                      LIVE
                    </span>
                  ) : incomingSession ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-extrabold animate-bounce">
                      RINGING
                    </span>
                  ) : null}
                </button>

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

                <button
                  onClick={() => { setActiveTab('astro_returns'); setSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'astro_returns'
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-4 h-4 text-amber-500" />
                    <span>Returns & Replacements</span>
                  </div>
                  {astroReturns.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold border border-amber-500/30">
                      {astroReturns.length}
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
                    <span>Tools</span>
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
        <header className={`border-b px-3.5 sm:px-6 py-3 sm:py-4 sticky top-0 z-30 transition-colors duration-300 shadow-md ${
          theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white/90 backdrop-blur-md border-slate-200'
        }`}>
          {/* MOBILE VIEWPORT HEADER (< md): Minimal Brand & Menu */}
          <div className="flex md:hidden items-center justify-between w-full">
            {/* Left: Hamburger menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-[#0b132b] text-gray-300 border-[#3a506b] hover:text-white' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Center: kuthiyengpham logo & brand */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#d97706] to-[#f59e0b] text-white flex items-center justify-center font-bold shadow-xs">
                <Moon className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className={`font-serif text-sm font-bold tracking-wide ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  kuthiyengpham
                </span>
                <span className="text-[9px] text-[#d97706] font-extrabold uppercase tracking-wider">
                  Guru Portal
                </span>
              </div>
            </div>

            {/* Right: Theme toggle & Profile icon */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                  theme === 'dark'
                    ? 'bg-[#0b132b] text-[#fbbf24] border-[#3a506b] hover:border-[#fbbf24]'
                    : 'bg-white text-slate-800 border-amber-300 hover:border-amber-500'
                }`}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 fill-slate-700" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center overflow-hidden transition-all cursor-pointer shadow-xs ${
                  activeTab === 'profile'
                    ? 'ring-2 ring-[#d97706] border-[#d97706]'
                    : theme === 'dark'
                    ? 'bg-[#0b132b] border-[#3a506b]'
                    : 'bg-white border-slate-300'
                }`}
                title="Guru Profile"
              >
                {profileForm.avatar ? (
                  <img
                    src={profileForm.avatar}
                    alt={profileForm.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-slate-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* DESKTOP VIEWPORT HEADER (>= md) */}
          <div className="hidden md:flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div>
                <h1 className={`font-serif font-bold text-xl flex items-center gap-2 ${
                  theme === 'dark' ? 'text-[#faf8f4]' : 'text-slate-900'
                }`}>
                  <span>Welcome, {profileForm.name}</span>
                  <ShieldCheck className="w-5 h-5 text-[#fbbf24]" />
                </h1>
                <p className="text-xs text-[#5c7a99]">
                  Empaneled Astrologer Management Portal • kuthiyengpham
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

          {/* TAB 0: LIVE CONSULTATION ROOM */}
          {activeTab === 'live_consultation' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
              }`}>
                <div>
                  <h3 className="font-bold text-lg text-amber-500 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-emerald-500 animate-pulse" />
                    Astrologer In-App Consultation Workspace
                  </h3>
                  <p className="text-xs text-slate-500">
                    Conduct live 1-on-1 chats and voice consultations directly inside kuthiyengpham.
                  </p>
                </div>
              </div>

              {activeLiveSessionId ? (
                <div className="space-y-3">
                  <div className={`p-3 rounded-2xl border flex items-center justify-between ${
                    theme === 'dark' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-bold font-mono">Live Room: {activeLiveSessionId}</span>
                    </div>
                    <button
                      onClick={() => setActiveLiveSessionId(null)}
                      className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Exit Room
                    </button>
                  </div>
                  <LiveConsultationRoom
                    sessionId={activeLiveSessionId}
                    currentUserType="ASTROLOGER"
                    onClose={() => setActiveLiveSessionId(null)}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Consultation Queue List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {desktopConsultations.map((s) => {
                      const isCompleted = s.status === 'COMPLETED';
                      const linkSent = !!s.meetingLinkSent;
                      const fee = s.totalFee || 525;
                      const payout = s.astrologerNetPayout || Math.round(fee * 0.85);
                      const modeLabel = s.mode === 'CHAT' ? 'Encrypted Live Chat' : `${s.callType || 'Video'} Call`;

                      return (
                        <div
                          key={s.id}
                          className={`p-5 rounded-2xl border space-y-3 transition-all ${
                            theme === 'dark'
                              ? isCompleted ? 'bg-[#151d32]/90 border-slate-700' : 'bg-[#1c2541] border-[#3a506b]'
                              : isCompleted ? 'bg-slate-50/80 border-slate-200' : 'bg-white border-slate-200 shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                                isCompleted
                                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500'
                                  : linkSent
                                  ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-500'
                                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-500'
                              }`}>
                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{s.clientName}</h4>
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                                    isCompleted
                                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                                      : linkSent
                                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                                      : 'bg-amber-500/20 text-amber-600 dark:text-amber-300'
                                  }`}>
                                    {isCompleted ? 'COMPLETED' : linkSent ? 'LINK READY' : 'AWAITING ADMIN LINK'}
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-500 font-mono block">
                                  Order Ref: {s.orderRef || s.id}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-mono font-bold text-emerald-500 block">
                                ₹{payout} {isCompleted ? 'Credited' : 'Net'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {s.durationMinutes || 15} Mins
                              </span>
                            </div>
                          </div>

                          {/* Details Summary */}
                          {isCompleted ? (
                            /* COMPLETED: Order & Session Details ONLY */
                            <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                              theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]/40 text-slate-300' : 'bg-slate-100/70 border-slate-200 text-slate-700'
                            }`}>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Service:</span>
                                <span className="font-semibold">{modeLabel}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Completed At:</span>
                                <span className="font-mono">{s.endedAt ? new Date(s.endedAt).toLocaleString() : s.scheduledDate || 'Today'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Client Details:</span>
                                <span className="font-mono text-slate-400 italic">[Redacted for privacy]</span>
                              </div>
                            </div>
                          ) : (
                            /* ACTIVE SESSION */
                            <div className={`p-2.5 rounded-xl border text-xs flex justify-between ${
                              theme === 'dark' ? 'bg-[#0b132b]/60 border-[#3a506b]/30 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}>
                              <span className="text-slate-400">Contact: {s.clientPhone || '+91 ••••• ••••'}</span>
                              <span className="text-amber-500 font-medium">{s.scheduledDate || 'Today'} ({s.shift || 'General'})</span>
                            </div>
                          )}

                          {/* Footer Action */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                            {isCompleted ? (
                              <>
                                <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Session Settled & Archived
                                </span>
                                <div className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold text-xs flex items-center gap-1.5 cursor-not-allowed border border-slate-300 dark:border-slate-700">
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>Chat Room Closed</span>
                                </div>
                              </>
                            ) : linkSent ? (
                              <>
                                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                  Link Dispatched by Admin
                                </span>
                                <button
                                  onClick={() => setActiveLiveSessionId(s.id)}
                                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>Join Live Consultation</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="text-xs text-amber-500 font-medium flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                                  Awaiting Admin Dispatch
                                </span>
                                <button
                                  disabled
                                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold text-xs flex items-center gap-1.5 cursor-not-allowed opacity-80"
                                  title="Meeting link will unlock once Admin dispatches it"
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>Link Pending Admin</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {desktopConsultations.length === 0 && (
                      <div className="col-span-2 text-center p-12 rounded-2xl border space-y-3 bg-white dark:bg-[#1c2541] border-slate-200 dark:border-[#3a506b]">
                        <MessageSquare className="w-12 h-12 text-slate-400 mx-auto" />
                        <h4 className="font-bold text-slate-700 dark:text-slate-200 text-base">No Active Live Sessions</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                          When a client books a consultation and Admin dispatches the link, your session card will appear here ready to join.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INCOMING CONSULTATION CALL POPUP ALERT */}
          {incomingSession && (
            <div className={`fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-4 ${
              theme === 'dark' ? 'bg-black/80' : 'bg-slate-900/60'
            }`}>
              <div className={`border-2 border-amber-500 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-5 relative overflow-hidden transition-colors ${
                theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'
              }`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500 animate-pulse"></div>

                <div className="w-20 h-20 bg-amber-500/20 text-amber-500 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-500/10 animate-bounce">
                  {incomingSession.mode === 'CALL' ? <Phone className="w-10 h-10" /> : <MessageSquare className="w-10 h-10" />}
                </div>

                <div className="space-y-1">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest block ${
                    theme === 'dark' ? 'text-amber-400' : 'text-amber-800'
                  }`}>
                    🔔 INCOMING CONSULTATION REQUEST
                  </span>
                  <h3 className={`font-serif font-bold text-2xl ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {incomingSession.clientName}
                  </h3>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600 font-medium'
                  }`}>
                    Requested {incomingSession.durationMinutes} Mins {incomingSession.mode === 'CALL' ? 'Voice Call' : 'Live Chat'} (₹{incomingSession.totalFee} Fee)
                  </p>
                </div>

                <div className={`p-3 rounded-2xl border text-xs text-left space-y-1 ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-amber-50/70 border-amber-200'
                }`}>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600 font-bold'}>Client Mobile:</span>
                    <span className={`font-mono font-bold ${theme === 'dark' ? 'text-amber-300' : 'text-amber-900'}`}>{incomingSession.clientPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600 font-bold'}>Gender / DOB:</span>
                    <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800 font-medium'}>{incomingSession.clientGender || 'N/A'} · {incomingSession.clientDob || 'N/A'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={async () => {
                      await fetch('/api/consultations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'REJECT_SESSION', sessionId: incomingSession.id }),
                      });
                      setIncomingSession(null);
                    }}
                    className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-red-400 font-bold text-xs border border-slate-700 transition"
                  >
                    Decline Request
                  </button>

                  <button
                    onClick={() => handleAcceptIncomingConsultation(incomingSession.id)}
                    className="py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Accept & Join Now</span>
                  </button>
                </div>
              </div>
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
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`text-[10px] font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>{order.clientDetails.sex}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                                order.clientDetails.faithTradition === 'Sanamahi Laining'
                                  ? 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200'
                                  : 'bg-orange-100 text-orange-950 border-orange-300 dark:bg-orange-950/60 dark:text-orange-200'
                              }`}>
                                {order.clientDetails.faithTradition === 'Sanamahi Laining' ? '☀️ Sanamahi' : '🕉️ Hinduism'}
                              </span>
                            </div>
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
                              <button
                                onClick={() => {
                                  setCalcForm((prev) => ({
                                    ...prev,
                                    name: order.clientName || 'Client',
                                    dob: order.clientDetails?.dob || '2026-08-28',
                                    tob: order.clientDetails?.tob || '06:00',
                                    pob: order.clientDetails?.pob || 'Imphal, Manipur',
                                    sex: order.clientDetails?.sex || 'Male',
                                    lat: 24.8170,
                                    lng: 93.9368,
                                    timezone: 5.5,
                                    ayanamsa: 'Lahiri',
                                  }));
                                  setActiveToolModal({
                                    id: 'vedic-workstation',
                                    title: 'Vedic Workstation (D1, D9, D10 & Gochara)',
                                  });
                                }}
                                className="px-2.5 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                                title="Open Client Chart in Vedic Workstation"
                              >
                                <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Workstation</span>
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
              <div className={`p-6 rounded-3xl border flex flex-wrap justify-between items-center gap-4 transition-colors shadow-sm ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <h3 className={`font-serif font-bold text-2xl ${theme === 'dark' ? 'text-[#faf8f4]' : 'text-slate-900'}`}>
                    Assigned Consultations & Kuthi Orders
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-[#5c7a99]' : 'text-slate-600'}`}>
                    Access client submitted birth details, inspect paper Kuthi uploads, & deliver astrological reports
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs block font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Assigned Orders Count</span>
                  <strong className={`text-xl font-serif font-bold ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-[#d97706]'}`}>{orders.length} Total</strong>
                </div>
              </div>

              {/* Consultations Table */}
              <div className={`rounded-3xl border shadow-xl overflow-hidden transition-colors ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b font-serif uppercase tracking-wider ${
                        theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-[#fbbf24]' : 'bg-slate-50 border-slate-200 text-amber-900 font-extrabold'
                      }`}>
                        <th className="p-4">Order Ref</th>
                        <th className="p-4">Client Info</th>
                        <th className="p-4">Kuthi / Birth Paper</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Payout Fee</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#3a506b]/50' : 'divide-slate-200'}`}>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className={`transition-colors ${
                          theme === 'dark' ? 'hover:bg-[#0b132b]/40' : 'hover:bg-slate-50'
                        }`}>
                          <td className={`p-4 font-mono font-bold ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-[#d97706]'}`}>{order.id}</td>
                          <td className="p-4">
                            <strong className={`text-sm block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{order.clientName}</strong>
                            <span className={`text-[10px] italic block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Contact Protected</span>
                          </td>
                          <td className="p-4">
                            {order.clientDetails.kuthiAttached ? (
                              <span className={`text-xs font-bold flex items-center gap-1 ${
                                theme === 'dark' ? 'text-amber-300' : 'text-amber-700'
                              }`}>
                                <Paperclip className="w-3.5 h-3.5 text-amber-500" />
                                {order.clientDetails.uploadedFiles && order.clientDetails.uploadedFiles.length > 1
                                  ? `${order.clientDetails.uploadedFiles.length} Kuthi Files Uploaded`
                                  : (order.clientDetails.kuthiFileName || 'Paper Kuthi Uploaded')}
                              </span>
                            ) : (
                              <span className={`text-xs italic ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`}>Birth Details Mode</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                              order.status === 'ASSIGNED' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30' :
                              order.status === 'IN_ANALYSIS' ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30' :
                              'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className={`p-4 font-mono font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>+₹{order.payoutFee}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setInspectingClient(order)}
                                className={`px-3 py-1.5 rounded-xl border font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                                  theme === 'dark'
                                    ? 'bg-[#0b132b] hover:bg-[#1e293b] text-sky-300 border-[#3a506b]'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-xs'
                                }`}
                              >
                                <Eye className="w-3.5 h-3.5 text-sky-500" />
                                <span>Inspect Details</span>
                              </button>
                              <button
                                onClick={() => {
                                  setCalcForm((prev) => ({
                                    ...prev,
                                    name: order.clientName || 'Client',
                                    dob: order.clientDetails?.dob || '2026-08-28',
                                    tob: order.clientDetails?.tob || '06:00',
                                    pob: order.clientDetails?.pob || 'Imphal, Manipur',
                                    sex: order.clientDetails?.sex || 'Male',
                                    lat: 24.8170,
                                    lng: 93.9368,
                                    timezone: 5.5,
                                    ayanamsa: 'Lahiri',
                                  }));
                                  setActiveToolModal({
                                    id: 'vedic-workstation',
                                    title: 'Vedic Workstation (D1, D9, D10 & Gochara)',
                                  });
                                }}
                                className="px-2.5 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                                title="Open Client Chart in Vedic Workstation"
                              >
                                <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Workstation</span>
                              </button>
                              <button
                                onClick={() => setUploadingOrder(order)}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs hover:opacity-95 cursor-pointer"
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
              <div className={`p-6 rounded-3xl border flex flex-wrap justify-between items-center gap-4 transition-colors shadow-sm ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <h3 className={`font-serif font-bold text-2xl ${theme === 'dark' ? 'text-[#faf8f4]' : 'text-slate-900'}`}>
                    My Wallet & Payout Ledger
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-[#5c7a99]' : 'text-slate-600'}`}>
                    Track consultation earnings, requested disbursements, & live Admin settlement UTR records
                  </p>
                </div>
                <button
                  onClick={() => setShowRequestPayoutModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Payout to Admin</span>
                </button>
              </div>

              {/* 3 Wallet Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-3xl border space-y-2 transition-colors shadow-sm ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                    Total Lifetime Earnings
                  </span>
                  <strong className={`text-3xl font-serif font-bold block ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>
                    ₹{wallet.totalEarnings.toLocaleString()}
                  </strong>
                  <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                    Total consultation revenue split accrued
                  </p>
                </div>
                <div className={`p-6 rounded-3xl border space-y-2 transition-colors shadow-sm ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                    Total Paid Out
                  </span>
                  <strong className={`text-3xl font-serif font-bold block ${theme === 'dark' ? 'text-sky-300' : 'text-sky-600'}`}>
                    ₹{wallet.totalPaidOut.toLocaleString()}
                  </strong>
                  <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                    Disbursed via UPI / Bank Transfer by Admin
                  </p>
                </div>
                <div className={`p-6 rounded-3xl border space-y-2 relative overflow-hidden transition-colors shadow-sm ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                }`}>
                  <div className="absolute top-0 right-0 p-4 text-green-500/10">
                    <Wallet className="w-20 h-20" />
                  </div>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider block">
                    Available Wallet Balance
                  </span>
                  <strong className="text-3xl font-serif font-bold text-green-600 dark:text-green-400 block">
                    ₹{wallet.pendingPayout.toLocaleString()}
                  </strong>
                  <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                    Ready for instant payout withdrawal
                  </p>
                </div>
              </div>

              {/* Transactions Ledger Table */}
              <div className={`rounded-3xl border shadow-xl overflow-hidden transition-colors ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
              }`}>
                <div className={`p-6 border-b ${theme === 'dark' ? 'border-[#3a506b]' : 'border-slate-200 bg-slate-50'}`}>
                  <h4 className={`font-serif font-bold text-lg ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-slate-900'}`}>
                    Transaction History Ledger
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b uppercase tracking-wider ${
                        theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-[#fbbf24]' : 'bg-slate-100 border-slate-200 text-slate-800 font-extrabold'
                      }`}>
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Details / Description</th>
                        <th className="p-4">UTR / Ref</th>
                        <th className="p-4 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y font-mono ${theme === 'dark' ? 'divide-[#3a506b]/50' : 'divide-slate-200 text-slate-900'}`}>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-[#0b132b]/40' : 'hover:bg-slate-50'}`}>
                          <td className={`p-4 font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{tx.id}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.type === 'CREDIT'
                                ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                                : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className={`p-4 font-sans ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>{tx.notes}</td>
                          <td className={`p-4 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>{tx.utr || tx.orderRef || 'N/A'}</td>
                          <td className={`p-4 text-right font-bold ${
                            tx.type === 'CREDIT' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
                          }`}>
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
              <div className={`p-6 rounded-3xl border space-y-4 transition-colors shadow-sm ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
              }`}>
                <h3 className={`font-serif font-bold text-2xl ${theme === 'dark' ? 'text-[#faf8f4]' : 'text-slate-900'}`}>
                  Availability & Working Shift Controls
                </h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-[#5c7a99]' : 'text-slate-600'}`}>
                  Set your real-time status and maximum daily consultation capacity
                </p>
                
                <div className={`p-6 rounded-2xl border space-y-4 transition-colors ${
                  theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <label className={`block text-xs font-bold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-900 font-extrabold'
                  }`}>
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
                        className={`px-6 py-3 rounded-2xl font-bold text-xs border transition-all cursor-pointer ${
                          availability === st
                            ? st === 'Online'
                              ? 'bg-green-600 border-green-500 text-white shadow-lg'
                              : st === 'Offline'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-red-600 border-red-500 text-white'
                            : theme === 'dark'
                            ? 'bg-[#1c2541] border-[#3a506b] text-gray-300 hover:border-[#fbbf24]'
                            : 'bg-white border-slate-300 text-slate-700 hover:border-amber-500 shadow-xs'
                        }`}
                      >
                        {st === 'Online' ? '🟢 Online & Ready for Orders' : st === 'Offline' ? '⚪ Offline' : '🔴 On Leave'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className={`p-6 rounded-2xl border space-y-3 transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <label className={`block text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      Max Daily Consultation Limit
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={profileForm.maxDailyOrders}
                      onChange={(e) => setProfileForm({ ...profileForm, maxDailyOrders: Number(e.target.value) })}
                      className={`w-full p-3 rounded-xl border font-mono font-bold text-sm ${
                        theme === 'dark'
                          ? 'bg-[#1c2541] border-[#3a506b] text-amber-300'
                          : 'bg-white border-slate-300 text-amber-900'
                      }`}
                    />
                    <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                      Admin will stop assigning new orders once this limit is reached in a 24-hr period.
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border space-y-3 transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <label className={`block text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      Shift Hours Configuration
                    </label>
                    <div className="space-y-2 text-xs">
                      <label className={`flex items-center gap-2 cursor-pointer ${
                        theme === 'dark' ? 'text-gray-300' : 'text-slate-700 font-medium'
                      }`}>
                        <input
                          type="checkbox"
                          checked={profileForm.morningSlot}
                          onChange={(e) => setProfileForm({ ...profileForm, morningSlot: e.target.checked })}
                          className="rounded text-[#d97706]"
                        />
                        <span>Morning Shift (09:00 AM – 01:00 PM IST)</span>
                      </label>
                      <label className={`flex items-center gap-2 cursor-pointer ${
                        theme === 'dark' ? 'text-gray-300' : 'text-slate-700 font-medium'
                      }`}>
                        <input
                          type="checkbox"
                          checked={profileForm.afternoonSlot}
                          onChange={(e) => setProfileForm({ ...profileForm, afternoonSlot: e.target.checked })}
                          className="rounded text-[#d97706]"
                        />
                        <span>Afternoon Shift (02:00 PM – 06:00 PM IST)</span>
                      </label>
                      <label className={`flex items-center gap-2 cursor-pointer ${
                        theme === 'dark' ? 'text-gray-300' : 'text-slate-700 font-medium'
                      }`}>
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
              {/* MOBILE-ONLY PROFILE VIEW (md:hidden): Quick Summary, Return to Overview, & Sign Out */}
              <div className="md:hidden space-y-4">
                {/* Return to Overview & Analytics Button */}
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border shadow-sm transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-[#1c2541] hover:bg-[#253256] text-[#fbbf24] border-[#3a506b]'
                      : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-200'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Return to Overview & Analytics</span>
                </button>

                {/* Mobile Profile Card with Basic Information */}
                <div className={`p-5 rounded-3xl border shadow-lg space-y-4 transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 p-0.5 shadow-md shrink-0 ${
                        theme === 'dark' ? 'bg-[#0b132b]' : 'bg-slate-100'
                      }`}>
                        <img
                          src={profileForm.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80'}
                          alt={profileForm.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0 shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className={`font-serif font-bold text-base truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {profileForm.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          {availability}
                        </span>
                      </div>
                      <p className="text-xs text-amber-500 font-mono line-clamp-1">{profileForm.specialty}</p>
                      <div className={`text-[11px] font-bold mt-0.5 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                        ₹{profileForm.pricePerMin} / min · {profileForm.experience} Yrs Exp
                      </div>
                    </div>
                  </div>

                  {/* Basic Info Details Grid */}
                  <div className={`grid grid-cols-1 gap-2.5 p-3 rounded-2xl border text-xs transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-gray-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="font-mono text-[11px]">{profileForm.whatsappNo || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate text-[11px]">{profileForm.email || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-[11px]">{profileForm.languages || 'Manipuri · English · Hindi'}</span>
                    </div>
                  </div>

                  {/* Mobile Profile Actions: Change Password & Sign Out */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(true)}
                      className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                        theme === 'dark'
                          ? 'bg-[#0b132b] hover:bg-[#142042] text-amber-300 border-[#3a506b]'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Update Portal Password</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAstroLogout}
                      className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out from Astrologer Portal</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Profile Form (Both Desktop & Mobile for editing) */}
              <div className={`p-6 rounded-3xl border space-y-6 transition-colors shadow-sm ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
              }`}>
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h3 className={`font-serif font-bold text-2xl ${theme === 'dark' ? 'text-[#faf8f4]' : 'text-slate-900'}`}>
                      Empaneled Guru Profile & Bio
                    </h3>
                    <p className={`text-xs ${theme === 'dark' ? 'text-[#5c7a99]' : 'text-slate-600'}`}>
                      Upload profile photo, manage credentials, consultation rate, & bio shown to clients
                    </p>
                  </div>
                  <button
                    onClick={handleSaveProfileSubmit}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Live</span>
                  </button>
                </div>

                {/* Profile Photo Upload & Preview Card */}
                <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center gap-6 transition-colors ${
                  theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="relative">
                    <div className={`w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-500 p-0.5 shadow-lg shrink-0 ${
                      theme === 'dark' ? 'bg-[#1c2541]' : 'bg-white'
                    }`}>
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
                      <h4 className={`font-serif font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{profileForm.name}</h4>
                      <p className="text-xs text-amber-500 font-mono">{profileForm.specialty}</p>
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

                      <div className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>or enter image URL below</div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className={`w-full p-3 rounded-xl border font-semibold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                        theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Profile Photo Image URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                      className={`w-full p-3 rounded-xl border font-mono text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                        theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-sky-300' : 'bg-white border-slate-300 text-sky-700'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Specialty Tagline *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.specialty}
                      onChange={(e) => setProfileForm({ ...profileForm, specialty: e.target.value })}
                      className={`w-full p-3 rounded-xl border font-semibold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                        theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Consultation Rate (₹ per Minute) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-amber-500 font-bold">₹</span>
                      <input
                        type="number"
                        required
                        min={10}
                        max={500}
                        value={profileForm.pricePerMin}
                        onChange={(e) => setProfileForm({ ...profileForm, pricePerMin: Number(e.target.value) })}
                        className={`w-full p-3 pl-8 rounded-xl border font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                          theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-amber-300' : 'bg-white border-slate-300 text-amber-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Years of Experience (e.g. 15) *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.experience}
                      onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                      className={`w-full p-3 rounded-xl border font-semibold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                        theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Languages Spoken *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.languages}
                      onChange={(e) => setProfileForm({ ...profileForm, languages: e.target.value })}
                      placeholder="e.g. Manipuri · English · Hindi"
                      className={`w-full p-3 rounded-xl border font-semibold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                        theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Specialty Tags (Comma Separated) *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.specialtiesStr}
                      onChange={(e) => setProfileForm({ ...profileForm, specialtiesStr: e.target.value })}
                      placeholder="e.g. Kuthi Yengba, Vedic, Matching"
                      className={`w-full p-3 rounded-xl border text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                        theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-amber-300' : 'bg-white border-slate-300 text-amber-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      WhatsApp Contact Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.whatsappNo}
                      onChange={(e) => setProfileForm({ ...profileForm, whatsappNo: e.target.value })}
                      className={`w-full p-3 rounded-xl border font-mono text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                        theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-amber-300' : 'bg-white border-slate-300 text-amber-900'
                      }`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Official Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className={`w-full p-3 rounded-xl border text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                        theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Astrological Bio & Credentials Summary *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className={`w-full p-3 rounded-xl border text-xs leading-relaxed focus:border-[#d97706] focus:outline-none transition-colors ${
                        theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
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
              {/* Store Section Quick Switcher Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveTab('astro_products')}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>My Products & Stock</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20 text-white font-mono">{myProducts.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('astro_orders')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                    theme === 'dark' ? 'bg-[#1c2541] text-gray-300 border border-[#3a506b] hover:border-[#fbbf24]' : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400 shadow-xs'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Seller Sales & Orders</span>
                  {myShopOrders.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-600 font-mono font-bold">{myShopOrders.length}</span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('astro_returns')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                    theme === 'dark' ? 'bg-[#1c2541] text-gray-300 border border-[#3a506b] hover:border-[#fbbf24]' : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400 shadow-xs'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                  <span>Returns & Replacements</span>
                  {astroReturns.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-600 font-mono font-bold">{astroReturns.length}</span>
                  )}
                </button>
              </div>

              <div className={`flex flex-wrap justify-between items-center p-6 rounded-3xl border gap-4 shadow-xl transition-colors ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase mb-2 border ${
                    theme === 'dark' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Astrologer Seller Product Catalog
                  </div>
                  <h3 className={`font-serif font-bold text-2xl ${theme === 'dark' ? 'text-[#faf8f4]' : 'text-slate-900'}`}>
                    Sell Your Consecrated Remedies & Yantras
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                    Add custom consecrated Shivlingas, energized rosaries, or specialized remedies to sell directly on kuthiyengpham Store. (Admin approval required before listing).
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
                <form onSubmit={handleSaveAstroProduct} className={`p-6 rounded-3xl border space-y-4 text-xs font-sans shadow-2xl transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <div className={`flex justify-between items-center pb-3 border-b ${
                    theme === 'dark' ? 'border-[#3a506b]' : 'border-slate-200'
                  }`}>
                    <h4 className={`font-serif font-bold text-xl ${
                      theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-900'
                    }`}>
                      Submit Product to E-Store (Requires Admin Verification)
                    </h4>
                    <button type="button" onClick={() => setEditingAstroProduct(null)} className={`p-1 cursor-pointer transition-colors ${
                      theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                    }`}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-8">
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-900 font-extrabold'
                      }`}>Product Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Consecrated Parad Shivlinga 150g"
                        value={editingAstroProduct.title || ''}
                        onChange={(e) => setEditingAstroProduct({ ...editingAstroProduct, title: e.target.value })}
                        className={`w-full h-10 px-3.5 rounded-xl border text-xs font-bold transition-colors focus:border-[#d97706] focus:outline-none ${
                          theme === 'dark' ? 'border-[#3a506b] bg-[#0b132b] text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                        }`}
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-900 font-extrabold'
                      }`}>Category *</label>
                      <select
                        value={editingAstroProduct.category || shopCategories[0] || 'Consecrated Remedies'}
                        onChange={(e) => setEditingAstroProduct({ ...editingAstroProduct, category: e.target.value })}
                        className={`w-full h-10 px-3.5 rounded-xl border text-xs font-bold transition-colors focus:border-[#d97706] focus:outline-none ${
                          theme === 'dark' ? 'border-[#3a506b] bg-[#0b132b] text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                        }`}
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
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-900 font-extrabold'
                      }`}>Selling Price (₹) *</label>
                      <input
                        type="number"
                        required
                        placeholder="1899"
                        value={editingAstroProduct.price || ''}
                        onChange={(e) => setEditingAstroProduct({ ...editingAstroProduct, price: Number(e.target.value) })}
                        className={`w-full h-10 px-3.5 rounded-xl border font-mono font-bold text-xs transition-colors focus:border-[#d97706] focus:outline-none ${
                          theme === 'dark' ? 'border-[#3a506b] bg-[#0b132b] text-[#fbbf24]' : 'border-slate-300 bg-slate-50 text-amber-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-900 font-extrabold'
                      }`}>Original MRP (₹)</label>
                      <input
                        type="number"
                        placeholder="2499"
                        value={editingAstroProduct.originalPrice || ''}
                        onChange={(e) => setEditingAstroProduct({ ...editingAstroProduct, originalPrice: Number(e.target.value) })}
                        className={`w-full h-10 px-3.5 rounded-xl border font-mono text-xs transition-colors focus:border-[#d97706] focus:outline-none ${
                          theme === 'dark' ? 'border-[#3a506b] bg-[#0b132b] text-gray-300' : 'border-slate-300 bg-slate-50 text-slate-700'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-900 font-extrabold'
                      }`}>Stock Quantity *</label>
                      <input
                        type="number"
                        required
                        placeholder="10"
                        value={editingAstroProduct.stock ?? 10}
                        onChange={(e) => setEditingAstroProduct({ ...editingAstroProduct, stock: Number(e.target.value) })}
                        className={`w-full h-10 px-3.5 rounded-xl border font-mono font-bold text-xs transition-colors focus:border-[#d97706] focus:outline-none ${
                          theme === 'dark' ? 'border-[#3a506b] bg-[#0b132b] text-green-400' : 'border-slate-300 bg-slate-50 text-green-700'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                      theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-900 font-extrabold'
                    }`}>Product Description Copy *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Describe the spiritual & astrological benefits..."
                      value={editingAstroProduct.description || ''}
                      onChange={(e) => setEditingAstroProduct({ ...editingAstroProduct, description: e.target.value })}
                      className={`w-full p-3 rounded-xl border text-xs transition-colors focus:border-[#d97706] focus:outline-none ${
                        theme === 'dark' ? 'border-[#3a506b] bg-[#0b132b] text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-5">
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-900 font-extrabold'
                      }`}>
                        Authenticity Badge / Tag
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Consecrated & Energized by Master Pandit"
                        value={editingAstroProduct.badge || 'Consecrated & Energized by Master Pandit'}
                        onChange={(e) => setEditingAstroProduct({ ...editingAstroProduct, badge: e.target.value })}
                        className={`w-full h-10 px-3.5 rounded-xl border font-bold text-xs transition-colors focus:border-[#d97706] focus:outline-none ${
                          theme === 'dark' ? 'border-[#3a506b] bg-[#0b132b] text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-7">
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-900 font-extrabold'
                      }`}>
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
                            className={`w-full h-10 px-3.5 pr-8 rounded-xl border text-xs font-mono transition-colors focus:border-[#d97706] focus:outline-none ${
                              theme === 'dark' ? 'border-[#3a506b] bg-[#0b132b] text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                            }`}
                          />
                          <ImageIcon className={`w-4 h-4 absolute right-3 top-3 pointer-events-none ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`} />
                        </div>
                      </div>

                      {/* Live Image Preview Box */}
                      {editingAstroProduct.image && (
                        <div className={`mt-2.5 p-2 rounded-xl border flex items-center gap-3 transition-colors ${
                          theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <img
                            src={editingAstroProduct.image}
                            alt="Product Preview"
                            className={`w-12 h-12 object-cover rounded-lg border shrink-0 ${
                              theme === 'dark' ? 'border-[#3a506b]' : 'border-slate-300'
                            }`}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div>
                            <span className={`text-[10px] font-bold block uppercase ${
                              theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-900'
                            }`}>Live Photo Preview</span>
                            <span className={`text-[9px] block line-clamp-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Photo ready for submission</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`flex justify-end gap-3 pt-3 border-t ${theme === 'dark' ? 'border-[#3a506b]' : 'border-slate-200'}`}>
                    <button
                      type="button"
                      onClick={() => setEditingAstroProduct(null)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                        theme === 'dark' ? 'bg-[#0b132b] text-gray-300 hover:bg-[#142042]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md cursor-pointer hover:opacity-95"
                    >
                      Submit for Admin Approval →
                    </button>
                  </div>
                </form>
              )}

              {/* PRODUCTS CATALOG TABLE */}
              <div className={`rounded-3xl border shadow-xl overflow-hidden transition-colors ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
              }`}>
                <div className={`p-6 border-b flex justify-between items-center ${
                  theme === 'dark' ? 'border-[#3a506b]' : 'border-slate-200 bg-slate-50'
                }`}>
                  <h4 className={`font-serif font-bold text-xl ${theme === 'dark' ? 'text-[#faf8f4]' : 'text-slate-900'}`}>My Submitted Products</h4>
                  <span className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Total Items: {myProducts.length}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b font-serif uppercase tracking-wider ${
                        theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-[#fbbf24]' : 'bg-slate-100 border-slate-200 text-slate-800 font-extrabold'
                      }`}>
                        <th className="p-4">Product Info</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Selling Price</th>
                        <th className="p-4">Net Astrologer Payout</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Admin Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#3a506b]/50' : 'divide-slate-200'}`}>
                      {myProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className={`p-8 text-center font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                            No products submitted yet. Click "+ Submit New Product" above to list your consecrated items.
                          </td>
                        </tr>
                      ) : (
                        myProducts.map((p) => {
                          const commPct = p.adminCommissionPct ?? 15;
                          const netPayout = Math.round((p.price * (100 - commPct)) / 100);
                          return (
                            <tr key={p.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-[#0b132b]/40' : 'hover:bg-slate-50'}`}>
                              <td className="p-4">
                                <div className={`font-extrabold text-sm flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                  <span>{p.title}</span>
                                  {p.sku && (
                                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 font-mono text-[10px] font-extrabold border border-purple-500/30 shrink-0">
                                      {p.sku}
                                    </span>
                                  )}
                                </div>
                                <div className="text-amber-600 dark:text-amber-300 text-[10px] font-mono">{p.badge}</div>
                              </td>
                              <td className={`p-4 font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{p.category}</td>
                              <td className={`p-4 font-mono font-bold ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-900'}`}>₹{p.price.toLocaleString()}</td>
                              <td className="p-4">
                                <span className={`font-mono font-extrabold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>₹{netPayout.toLocaleString()}</span>
                                <span className={`text-[10px] block font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>({commPct}% Admin Fee deducted)</span>
                              </td>
                              <td className={`p-4 font-mono font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{p.stock} units</td>
                              <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                                  p.status === 'APPROVED'
                                    ? 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30'
                                    : p.status === 'REJECTED'
                                    ? 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30'
                                    : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
                                }`}>
                                  {p.status === 'APPROVED' ? '✅ Approved & Live' : p.status === 'REJECTED' ? '❌ Rejected' : '⏳ Awaiting Admin Approval'}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => setEditingAstroProduct(p)}
                                  className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1 mx-auto transition-colors cursor-pointer ${
                                    theme === 'dark'
                                      ? 'bg-[#0b132b] hover:bg-[#334155] text-[#fbbf24] border-[#3a506b]'
                                      : 'bg-white hover:bg-slate-100 text-amber-900 border-slate-300 shadow-xs'
                                  }`}
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
              {/* Store Section Quick Switcher Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveTab('astro_products')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                    theme === 'dark' ? 'bg-[#1c2541] text-gray-300 border border-[#3a506b] hover:border-[#fbbf24]' : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400 shadow-xs'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>My Products & Stock</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20 text-white font-mono">{myProducts.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('astro_orders')}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md cursor-pointer"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Seller Sales & Orders</span>
                  {myShopOrders.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono font-bold">{myShopOrders.length}</span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('astro_returns')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                    theme === 'dark' ? 'bg-[#1c2541] text-gray-300 border border-[#3a506b] hover:border-[#fbbf24]' : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400 shadow-xs'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                  <span>Returns & Replacements</span>
                  {astroReturns.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-600 font-mono font-bold">{astroReturns.length}</span>
                  )}
                </button>
              </div>

              <div className={`p-6 rounded-3xl border shadow-xl space-y-2 transition-colors ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
              }`}>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                  theme === 'dark' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  <Tag className="w-3.5 h-3.5" />
                  Seller Sales & Client Purchases
                </div>
                <h3 className={`font-serif font-bold text-2xl ${theme === 'dark' ? 'text-[#faf8f4]' : 'text-slate-900'}`}>
                  Orders Received for Your Products
                </h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                  Track orders placed by buyers for your submitted items. Admin confirms payments and credits net payouts directly to your wallet.
                </p>
              </div>

              <div className={`rounded-3xl border shadow-xl overflow-hidden transition-colors ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b font-serif uppercase tracking-wider ${
                        theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-[#fbbf24]' : 'bg-slate-100 border-slate-200 text-slate-800 font-extrabold'
                      }`}>
                        <th className="p-4">Order Ref</th>
                        <th className="p-4">Buyer Contact</th>
                        <th className="p-4">Items Sold</th>
                        <th className="p-4">Client Paid</th>
                        <th className="p-4">Admin Commission</th>
                        <th className="p-4">My Net Payout</th>
                        <th className="p-4">Admin Status</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#3a506b]/50' : 'divide-slate-200'}`}>
                      {myShopOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className={`p-8 text-center font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                            No seller orders placed yet for your items.
                          </td>
                        </tr>
                      ) : (
                        myShopOrders.map((ord) => {
                          const astroItems = ord.items.filter((it: any) => (profileForm.name && it.sellerName === profileForm.name) || (profileForm.phone && it.sellerId === profileForm.phone));
                          const totalClientPrice = astroItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
                          const totalComm = astroItems.reduce((s: number, i: any) => s + (i.adminCommissionAmount || 0), 0);
                          const totalNet = totalClientPrice - totalComm;

                          return (
                            <tr key={ord.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-[#0b132b]/40' : 'hover:bg-slate-50'}`}>
                              <td className={`p-4 font-mono font-bold ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-900'}`}>{ord.orderRef}</td>
                              <td className="p-4">
                                <div className={`font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{ord.buyerName}</div>
                                <div className={`text-[10px] italic ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Client Contact Protected</div>
                              </td>
                              <td className="p-4">
                                {astroItems.map((it: any, idx: number) => (
                                  <div key={idx} className={`font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                                    • {it.title} <span className={theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-900 font-bold'}>x{it.quantity}</span>
                                  </div>
                                ))}
                              </td>
                              <td className={`p-4 font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{totalClientPrice.toLocaleString()}</td>
                              <td className={`p-4 font-mono ${theme === 'dark' ? 'text-amber-300' : 'text-amber-900 font-bold'}`}>₹{totalComm.toLocaleString()}</td>
                              <td className={`p-4 font-mono font-extrabold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>₹{totalNet.toLocaleString()}</td>
                              <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                                  ord.adminConfirmed
                                    ? 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30'
                                    : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
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

          {/* TAB 1D: ASTROLOGER RETURNS & REPLACEMENTS TRACKING */}
          {activeTab === 'astro_returns' && (
            <div className="space-y-6">
              {/* Store Section Quick Switcher Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveTab('astro_products')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                    theme === 'dark' ? 'bg-[#1c2541] text-gray-300 border border-[#3a506b] hover:border-[#fbbf24]' : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400 shadow-xs'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>My Products & Stock</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20 text-white font-mono">{myProducts.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('astro_orders')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                    theme === 'dark' ? 'bg-[#1c2541] text-gray-300 border border-[#3a506b] hover:border-[#fbbf24]' : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400 shadow-xs'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Seller Sales & Orders</span>
                  {myShopOrders.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-600 font-mono font-bold">{myShopOrders.length}</span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('astro_returns')}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-white" />
                  <span>Returns & Replacements</span>
                  {astroReturns.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono font-bold">{astroReturns.length}</span>
                  )}
                </button>
              </div>

              {/* Header Card */}
              <div className={`p-6 rounded-3xl border shadow-xl flex flex-wrap justify-between items-center gap-4 transition-colors ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-amber-200/80 shadow-sm'
              }`}>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbbf24]/20 text-[#d97706] dark:text-[#fbbf24] text-xs font-extrabold uppercase mb-2 border border-[#fbbf24]/30">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Product Replacement & Refund Tracking
                  </div>
                  <h3 className={`font-serif font-bold text-2xl ${theme === 'dark' ? 'text-[#faf8f4]' : 'text-slate-900'}`}>
                    Customer Returns & Admin Approval Status
                  </h3>
                  <p className={`text-xs mt-1 max-w-2xl ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                    Monitor customer return and replacement requests for your consecrated store products. Check whether Admin has approved replacement, issued refund, or rejected, with transparent action notes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchAstroReturns}
                    disabled={loadingReturns}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#0b132b] text-[#fbbf24] border-[#3a506b] hover:border-[#fbbf24]'
                        : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 shadow-xs'
                    }`}
                    title="Refresh Returns Status"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingReturns ? 'animate-spin' : ''}`} />
                    <span>{loadingReturns ? 'Syncing...' : 'Sync Returns'}</span>
                  </button>
                </div>
              </div>

              {/* Status Overview Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Claims</span>
                  <span className={`text-2xl font-serif font-bold block mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {astroReturns.length}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 block">Customer ticket submissions</span>
                </div>

                <div className={`p-4 rounded-2xl border transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">⏳ Pending Admin</span>
                  <span className="text-2xl font-serif font-bold text-amber-500 block mt-1">
                    {astroReturns.filter((r) => r.status === 'PENDING').length}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 block">Awaiting admin verification</span>
                </div>

                <div className={`p-4 rounded-2xl border transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider block">🔁 Approved Replacement</span>
                  <span className="text-2xl font-serif font-bold text-blue-500 block mt-1">
                    {astroReturns.filter((r) => r.status === 'APPROVED_REPLACEMENT').length}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 block">Ship blessed replacement</span>
                </div>

                <div className={`p-4 rounded-2xl border transition-colors ${
                  theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider block">💸 Approved Refund</span>
                  <span className="text-2xl font-serif font-bold text-emerald-500 block mt-1">
                    {astroReturns.filter((r) => r.status === 'APPROVED_REFUND').length}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 block">Admin refunded client</span>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 shrink-0">Filter:</span>
                {[
                  { id: 'ALL', label: 'All Status' },
                  { id: 'PENDING', label: '⏳ Pending Admin' },
                  { id: 'APPROVED_REPLACEMENT', label: '🔁 Approved Replacement' },
                  { id: 'APPROVED_REFUND', label: '💸 Approved Refund' },
                  { id: 'REJECTED', label: '❌ Rejected' },
                  { id: 'RESOLVED', label: '✅ Resolved' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setReturnStatusFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      returnStatusFilter === f.id
                        ? 'bg-[#d97706] text-white shadow-xs'
                        : theme === 'dark'
                        ? 'bg-[#0b132b] text-gray-300 border border-[#3a506b] hover:border-[#fbbf24]'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400 shadow-xs'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Returns Table */}
              <div className={`rounded-3xl border shadow-xl overflow-hidden transition-colors ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b font-serif uppercase tracking-wider ${
                        theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-[#fbbf24]' : 'bg-slate-50 border-slate-200 text-amber-900'
                      }`}>
                        <th className="p-4">RMA Ref / Date</th>
                        <th className="p-4">Product & Customer</th>
                        <th className="p-4">Request Type</th>
                        <th className="p-4">Reason & Issue Reported</th>
                        <th className="p-4">Admin Status</th>
                        <th className="p-4">Admin Resolution / Remarks</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#3a506b]/50' : 'divide-slate-200'}`}>
                      {(() => {
                        const filtered = astroReturns.filter((r) => {
                          if (returnStatusFilter === 'ALL') return true;
                          return r.status === returnStatusFilter;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-gray-400 font-medium">
                                No return or replacement requests match the selected status filter.
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((item) => {
                          const isReplacement = item.requestType === 'REPLACEMENT';
                          return (
                            <tr key={item.id} className={`transition-colors ${
                              theme === 'dark' ? 'hover:bg-[#0b132b]/40' : 'hover:bg-slate-50'
                            }`}>
                              {/* RMA Ref / Date */}
                              <td className="p-4">
                                <span className="font-mono font-bold text-[#d97706] dark:text-[#fbbf24] block">
                                  {item.id}
                                </span>
                                <span className={`text-[10px] font-mono block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                  Order: {item.orderRef}
                                </span>
                                <span className={`text-[9px] block mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>
                                  {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </span>
                              </td>

                              {/* Product & Customer */}
                              <td className="p-4">
                                <div className={`font-extrabold text-xs block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                  {item.productTitle}
                                </div>
                                <div className={`text-[11px] mt-0.5 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                                  Buyer: {item.customerName}
                                </div>
                                <div className={`text-[10px] font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                  {item.customerPhone}
                                </div>
                              </td>

                              {/* Request Type */}
                              <td className="p-4">
                                {isReplacement ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Replacement</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                                    <span>💸 Refund Request</span>
                                  </span>
                                )}
                                {item.refundMethod && (
                                  <span className={`block text-[9px] font-mono mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                    via {item.refundMethod}
                                  </span>
                                )}
                              </td>

                              {/* Reason & Issue */}
                              <td className="p-4 max-w-xs">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold mb-1 ${
                                  item.reason === 'DAMAGED_TRANSIT'
                                    ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                                    : item.reason === 'DEFECTIVE_QUALITY'
                                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                    : 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                                }`}>
                                  {item.reason === 'DAMAGED_TRANSIT'
                                    ? '📦 Damaged in Courier'
                                    : item.reason === 'DEFECTIVE_QUALITY'
                                    ? '⚠️ Defective Quality'
                                    : item.reason === 'WRONG_ITEM'
                                    ? '🔁 Wrong Item'
                                    : '❓ Other Issue'}
                                </span>
                                <p className={`text-[11px] line-clamp-2 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                  {item.reasonDetails || 'No customer explanation provided.'}
                                </p>
                              </td>

                              {/* Admin Approval Status */}
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                                  item.status === 'APPROVED_REPLACEMENT'
                                    ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30'
                                    : item.status === 'APPROVED_REFUND'
                                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                                    : item.status === 'REJECTED'
                                    ? 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30'
                                    : item.status === 'RESOLVED'
                                    ? 'bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30'
                                    : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 animate-pulse'
                                }`}>
                                  {item.status === 'APPROVED_REPLACEMENT' && '✅ Replacement Approved'}
                                  {item.status === 'APPROVED_REFUND' && '💰 Refund Approved'}
                                  {item.status === 'PENDING' && '⏳ Awaiting Admin'}
                                  {item.status === 'REJECTED' && '❌ Claim Rejected'}
                                  {item.status === 'RESOLVED' && '✔ Resolved'}
                                </span>
                              </td>

                              {/* Admin Resolution / Remarks */}
                              <td className="p-4 max-w-xs">
                                {item.adminNotes ? (
                                  <div className={`p-2 rounded-xl text-[11px] leading-relaxed border ${
                                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-gray-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                                  }`}>
                                    <span className="text-[9px] font-bold uppercase text-[#d97706] block">Admin Remarks:</span>
                                    {item.adminNotes}
                                  </div>
                                ) : (
                                  <span className={`text-[10px] italic ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>
                                    No admin notes yet
                                  </span>
                                )}
                              </td>

                              {/* Action: Inspect */}
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => setSelectedReturnDetail(item)}
                                  className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1 mx-auto transition-colors cursor-pointer ${
                                    theme === 'dark'
                                      ? 'bg-[#0b132b] hover:bg-[#334155] text-[#fbbf24] border-[#3a506b]'
                                      : 'bg-white hover:bg-slate-100 text-amber-800 border-amber-300 shadow-xs'
                                  }`}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Details</span>
                                </button>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TOOLS */}
          {activeTab === 'tools' && (
            <div className="space-y-6">
              
              {/* Workspace Header Banner */}
              <div className={`p-6 rounded-3xl border shadow-sm flex flex-wrap justify-between items-center gap-4 transition-colors ${
                theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-[#f3e8d2] text-slate-900'
              }`}>
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2 bg-[#fef3c7] text-[#b45309] border border-[#fde68a]">
                    <Sparkles className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                    Empaneled Astrologer Workspace Suite
                  </div>
                  <h3 className={`font-serif font-bold text-2xl sm:text-3xl ${
                    theme === 'dark' ? 'text-[#fbbf24]' : 'text-[#0f172a]'
                  }`}>
                    Tools & Astrological Engines
                  </h3>
                  <p className={`text-xs font-medium mt-1 max-w-2xl ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Access your Admin-permitted tools to analyze Client Birth Charts, Traditional Yumsharol Vastu, Vimshottari Dashas, Shani Sade Sati, Kaal Sarp Dosh, Yogas, and Marriage Match Making.
                  </p>
                </div>

                <div className={`px-4 py-2 rounded-2xl border text-xs font-bold font-mono ${
                  theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-[#fbbf24]' : 'bg-[#faf8f5] border-[#f3e8d2] text-[#b45309]'
                }`}>
                  ⚡ {ACTIVE_TOOLS_REGISTRY.length} Active Tools
                </div>
              </div>

              {/* TOOL CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ACTIVE_TOOLS_REGISTRY.map((t) => (
                  <div
                    key={t.id}
                    className={`p-6 rounded-3xl border shadow-sm hover:shadow-xl hover:border-[#d97706] transition-all flex flex-col justify-between space-y-5 group ${
                      theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-[#f3e8d2] text-slate-900'
                    }`}
                  >
                    <div className="space-y-3.5">
                      {/* Icon Box matching 2.png */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xs group-hover:scale-110 transition-transform ${
                        theme === 'dark' ? 'bg-[#0b132b] text-[#fbbf24] border border-[#3a506b]' : 'bg-[#fef3c7]/80 text-[#d97706] border border-[#fde68a]'
                      }`}>
                        {t.id === 'vedic-workstation' ? '🪐' :
                         t.id === 'yumsharol' ? '🏡' :
                         t.id === 'nga-eeshing' ? '🐟' :
                         t.id === 'dasha-yengpham' ? '📜' :
                         t.id === 'shani-sade-sati' ? '🪐' :
                         t.id === 'mangalik-dosh' ? '🔥' :
                         t.id === 'kaal-sarp-dosh' ? '🐍' :
                         t.id === 'astrology-yoga' ? '✨' :
                         t.id === 'match-making' ? '💍' : '📊'}
                      </div>

                      <div>
                        <h4 className={`font-serif font-bold text-xl transition-colors ${
                          theme === 'dark' ? 'text-white group-hover:text-[#fbbf24]' : 'text-[#0f172a] group-hover:text-[#c69214]'
                        }`}>
                          {t.title}
                        </h4>
                        <p className={`text-xs font-sans leading-relaxed mt-1.5 font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {t.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Gold Button matching 2.png */}
                    <button
                      onClick={() => {
                        setActiveToolModal(t);
                        setCalcResult(null);
                      }}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] hover:from-[#b45309] hover:to-[#d97706] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] border border-[#fde68a]/40"
                    >
                      <span>Calculate Now</span>
                      <Sparkles className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>

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
              
              {/* Kuthi File Attachment Box & Multi-file Downloads */}
              {(() => {
                const files: string[] = (inspectingClient.clientDetails.uploadedFiles && inspectingClient.clientDetails.uploadedFiles.length > 0)
                  ? inspectingClient.clientDetails.uploadedFiles
                  : (inspectingClient.clientDetails.kuthiFileName ? [inspectingClient.clientDetails.kuthiFileName] : []);
                const fileUrl = inspectingClient.clientDetails.kuthiFileUrl || '/sample_kuthi.pdf';

                const handleDownloadAll = () => {
                  files.forEach((name, idx) => {
                    setTimeout(() => {
                      const a = document.createElement('a');
                      a.href = fileUrl;
                      a.download = name;
                      a.target = '_blank';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }, idx * 350);
                  });
                };

                return inspectingClient.clientDetails.kuthiAttached ? (
                  <div className={`p-5 rounded-2xl border space-y-3.5 ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-xs uppercase tracking-wider block ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-800'}`}>
                            Customer Uploaded Kundli / Kuthi
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-extrabold">
                            {files.length} {files.length === 1 ? 'File' : 'Files'} Attached
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                          Original birth charts, scans, and documents uploaded by the customer
                        </p>
                      </div>

                      {/* Download All Button */}
                      <button
                        onClick={handleDownloadAll}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-white font-bold text-xs flex items-center gap-2 shadow-md shrink-0 transition-all active:scale-95 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download All Uploaded ({files.length})</span>
                      </button>
                    </div>

                    {/* Files list */}
                    <div className="space-y-2 pt-1">
                      {files.map((fileName, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                            theme === 'dark' ? 'bg-[#1c2541]/70 border-[#3a506b]/50' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 mr-3">
                            <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                            <div className="truncate">
                              <span className="font-mono font-bold block truncate">{fileName}</span>
                              <span className={`text-[10px] block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                Original Customer Document • Part {idx + 1}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = fileUrl;
                              a.download = fileName;
                              a.target = '_blank';
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }}
                            className={`px-3 py-1.5 rounded-lg border font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                              theme === 'dark'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`p-5 rounded-2xl border flex items-center justify-between ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}>
                    <div>
                      <span className={`font-bold text-xs uppercase tracking-wider block ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-800'}`}>Attached Physical Kuthi File</span>
                      <strong className={`text-sm block mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        No Physical Paper Uploaded (Use Birth Details Below)
                      </strong>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl border font-bold text-xs ${
                      theme === 'dark' ? 'bg-[#1e293b] text-gray-300 border-[#3a506b]' : 'bg-slate-200 text-slate-800 border-slate-300'
                    }`}>
                      Birth Details Mode
                    </span>
                  </div>
                );
              })()}

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
                    <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Contact Details</span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border inline-block mt-0.5 ${
                      theme === 'dark' ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      Protected by Admin
                    </span>
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
                        <span className={`text-xs font-bold block mb-1 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-800'}`}>👰 Bride Birth Details</span>
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
                    <div className={`col-span-2 p-2.5 rounded-xl border flex items-center justify-between mt-1 ${
                      theme === 'dark'
                        ? 'bg-amber-950/30 border-amber-500/40'
                        : 'bg-amber-50/70 border-amber-300'
                    }`}>
                      <div>
                        <span className={`text-[10px] uppercase font-bold block ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>Faith Tradition & Identity</span>
                        <strong className={`text-xs ${
                          theme === 'dark' ? 'text-amber-200' : 'text-amber-900'
                        }`}>
                          {inspectingClient.clientDetails.faithTradition === 'Sanamahi Laining' ? '☀️ Sanamahi Laining (Indigenous Meetei)' : '🕉️ Hinduism (Vedic Manipuri)'}
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] uppercase font-bold block ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {inspectingClient.clientDetails.faithTradition === 'Sanamahi Laining' ? 'Yek Salai' : 'Gotra (সালয়)'}
                        </span>
                        <strong className={`text-xs ${
                          theme === 'dark' ? 'text-[#fbbf24]' : 'text-[#b45309]'
                        }`}>
                          {inspectingClient.clientDetails.faithTradition === 'Sanamahi Laining'
                            ? (inspectingClient.clientDetails.yek || inspectingClient.clientDetails.gotra || 'Khuman')
                            : (inspectingClient.clientDetails.gotra || 'Sandilya')}
                        </strong>
                      </div>
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
              <div className="flex flex-wrap justify-between items-center gap-2 pt-2">
                <div className="flex flex-wrap items-center gap-2">
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
                    onClick={() => {
                      const client = inspectingClient;
                      setCalcForm((prev) => ({
                        ...prev,
                        name: client.clientName || 'Client',
                        dob: client.clientDetails?.dob || '2026-08-28',
                        tob: client.clientDetails?.tob || '06:00',
                        pob: client.clientDetails?.pob || 'Imphal, Manipur',
                        sex: client.clientDetails?.sex || 'Male',
                        lat: 24.8170,
                        lng: 93.9368,
                        timezone: 5.5,
                        ayanamsa: 'Lahiri',
                      }));
                      setInspectingClient(null);
                      setActiveToolModal({
                        id: 'vedic-workstation',
                        title: 'Vedic Workstation (D1, D9, D10 & Gochara)',
                      });
                    }}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xs transition-all cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-emerald-200" />
                    <span>Open in Vedic Workstation 🪐</span>
                  </button>
                </div>

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
          <div className={`absolute inset-0 backdrop-blur-xs ${
            theme === 'dark' ? 'bg-black/70' : 'bg-slate-900/50'
          }`} onClick={() => setUploadingOrder(null)} />
          <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl p-6 space-y-4 z-10 text-xs transition-colors ${
            theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex justify-between items-center pb-3 border-b ${
              theme === 'dark' ? 'border-[#3a506b]' : 'border-slate-200'
            }`}>
              <div>
                <h4 className={`font-serif font-bold text-lg flex items-center gap-2 ${
                  theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-900'
                }`}>
                  <FileText className="w-5 h-5 text-[#d97706]" />
                  Upload Completed Consultation Report
                </h4>
                <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                  Client: <strong className={theme === 'dark' ? 'text-[#faf8f4]' : 'text-slate-900'}>{uploadingOrder.clientName}</strong> ({uploadingOrder.orderRef || uploadingOrder.id})
                </p>
              </div>
              <button
                onClick={() => setUploadingOrder(null)}
                className={`p-1 transition-colors cursor-pointer ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadMsg && (
              <div className={`p-3 rounded-xl border text-xs font-bold text-center ${
                uploadMsg.startsWith('✅')
                  ? (theme === 'dark' ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-green-50 border-green-300 text-green-800')
                  : (theme === 'dark' ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-red-50 border-red-300 text-red-800')
              }`}>
                {uploadMsg}
              </div>
            )}

            <form onSubmit={handleUploadReportSubmit} className="space-y-4 font-sans">
              {/* Native File Input for Computer & Mobile Phone */}
              <div>
                <label className={`block font-bold mb-1 uppercase tracking-wider text-[10px] ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-800'
                }`}>
                  Choose Report File From Device (Phone / Computer)<span className="text-red-500">*</span>
                </label>
                
                <input
                  type="file"
                  id="astrologer-report-file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                    theme === 'dark' ? 'bg-[#0b132b] border-green-500/50' : 'bg-emerald-50/70 border-emerald-300'
                  }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30 flex items-center justify-center shrink-0 font-bold">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className={`font-bold text-xs truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {selectedFile.name}
                        </div>
                        <div className="text-[10px] text-green-600 dark:text-green-400 mt-0.5 font-mono flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                          <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload</span>
                        </div>
                      </div>
                    </div>
                    <label
                      htmlFor="astrologer-report-file"
                      className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer shrink-0 transition-colors ${
                        theme === 'dark'
                          ? 'bg-[#1c2541] hover:bg-[#253356] border-[#3a506b] text-amber-400'
                          : 'bg-white hover:bg-slate-50 border-slate-300 text-amber-800 shadow-2xs'
                      }`}
                    >
                      Change File
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="astrologer-report-file"
                    className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all text-center group ${
                      theme === 'dark'
                        ? 'border-[#3a506b] hover:border-amber-400 bg-[#0b132b]/60 hover:bg-[#0b132b]'
                        : 'border-slate-300 hover:border-amber-500 bg-slate-50/70 hover:bg-amber-50/40'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Tap here to choose PDF report file from phone or computer
                    </span>
                    <span className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                      Supports PDF documents (.pdf), Word (.docx), or JPG/PNG images
                    </span>
                  </label>
                )}
              </div>

              <div>
                <label className={`block font-bold mb-1 uppercase tracking-wider text-[10px] ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-800'
                }`}>
                  Report File Title / Document Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acharya_Sharma_Marriage_Report.pdf"
                  value={uploadForm.reportFileName}
                  onChange={(e) => setUploadForm({ ...uploadForm, reportFileName: e.target.value })}
                  className={`w-full p-3 rounded-xl font-semibold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#0b132b] border border-[#3a506b] text-white'
                      : 'bg-white border border-slate-300 text-slate-900 shadow-xs'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-bold mb-1 uppercase tracking-wider text-[10px] ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-800'
                }`}>
                  Astrologer Summary & Prescribed Remedies Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of planetary chart findings, Vimshottari Dasha analysis, gemstone advice, or special Vedic mantras..."
                  value={uploadForm.reportNotes}
                  onChange={(e) => setUploadForm({ ...uploadForm, reportNotes: e.target.value })}
                  className={`w-full p-3 rounded-xl text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#0b132b] border border-[#3a506b] text-white'
                      : 'bg-white border border-slate-300 text-slate-900 shadow-xs'
                  }`}
                />
              </div>

              <div className={`p-3 rounded-xl border flex justify-between items-center text-xs ${
                theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'}>Commission Payout Credit:</span>
                <span className="font-mono font-bold text-green-600 dark:text-green-400">+₹{uploadingOrder.payoutFee} to Wallet</span>
              </div>

              <div className={`flex justify-end gap-2 pt-2 border-t ${
                theme === 'dark' ? 'border-[#3a506b]' : 'border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setUploadingOrder(null)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] text-gray-300 hover:bg-[#334155]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingUpload}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 hover:opacity-95 cursor-pointer"
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
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs ${
          theme === 'dark' ? 'bg-[#0b132b]/85' : 'bg-slate-900/60'
        }`}>
          {activeToolModal.id === 'vedic-workstation' ? (
            <div className="w-full max-w-7xl max-h-[96vh] overflow-y-auto rounded-3xl shadow-2xl">
              <VedicWorkstation
                initialBirthData={{
                  name: calcForm.name || 'Sanatomba Meitei',
                  dob: calcForm.dob || '2026-08-28',
                  tob: calcForm.tob || '06:00',
                  pob: calcForm.pob || 'Imphal, Manipur',
                  lat: Number(calcForm.lat) || 24.8170,
                  lng: Number(calcForm.lng) || 93.9368,
                  timezone: Number(calcForm.timezone) || 5.5,
                  sex: calcForm.sex || 'Male',
                }}
                onClose={() => {
                  setActiveToolModal(null);
                  setCalcResult(null);
                }}
              />
            </div>
          ) : (
            <div className={`w-full max-w-5xl xl:max-w-6xl rounded-3xl border shadow-2xl overflow-hidden relative text-left font-sans p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto transition-colors ${
              theme === 'dark'
                ? 'bg-[#1c2541] border-[#3a506b] text-white'
                : 'bg-[#fffdfa] border-[#f3e8d2] text-slate-900'
            }`}>
              {/* Header */}
              <div className={`flex items-center justify-between border-b pb-4 ${
                theme === 'dark' ? 'border-[#3a506b]' : 'border-[#f3e8d2]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-[#0b132b] border-[#3a506b]'
                      : 'bg-amber-100 border-amber-300'
                  }`}>
                    <Sparkles className={`w-6 h-6 ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-[#b45309]'}`} />
                  </div>
                  <div>
                    <h3 className={`font-serif font-bold text-xl ${
                      theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-900'
                    }`}>
                      {activeToolModal.title}
                    </h3>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                      Astrologer Tool • Run calculations for client
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setActiveToolModal(null); setCalcResult(null); setYumsharolValidationErr(''); }}
                  className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-800 hover:bg-amber-100/50'
                  }`}
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

                    if (mType === 'yumsharol' || activeToolModal.id === 'yumsharol') {
                      try {
                        setYumsharolValidationErr('');
                        const res = calculateYumsharol({
                          dob: calcForm.dob,
                          tob: calcForm.tob || '12:00',
                          nakshatra: Number(calcForm.nakshatra) || 1,
                          constantValue: Number(calcForm.constantValue) || 15,
                        });

                        setCalcResult({
                          isYumsharol: true,
                          type: 'Yumsharol (Traditional Vastu & House Science)',
                          name: calcForm.name,
                          ...res,
                        });
                      } catch (err: any) {
                        setYumsharolValidationErr(err.message || 'Error calculating Yumsharol.');
                      }
                      return;
                    }

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

                      // Calculate Moon Rashi & Excel =Basic!C36 representation (SignIndex|Deg°|Min'|Sec")
                      const moonSignIndex = moonObj.signIndex;
                      const moonSignDegree = moonObj.signDegree;
                      const moonDeg = Math.floor(moonSignDegree);
                      const moonMin = Math.floor((moonSignDegree % 1) * 60);
                      const moonSec = Math.round((((moonSignDegree % 1) * 60) % 1) * 60);

                      // Basic!C36 formula: K17-1&"|"&B17&"°"&"|"&D17&"'"&"|"&O17&""""
                      const basicC36Value = `${moonSignIndex}|${moonDeg}°|${moonMin}'|${moonSec}"`;
                      const basicC36Bengali = `${toBengaliDigits(moonSignIndex)}|${toBengaliDigits(moonDeg)}°|${toBengaliDigits(moonMin)}'|${toBengaliDigits(moonSec)}"`;

                      const moonItem = {
                        id: 'mo',
                        name: 'Moon / Chandra (চন্দ্র)',
                        bengaliName: 'চন্দ্র',
                        signIndex: moonSignIndex,
                        signName: BENGALI_RASHI_NAMES[moonSignIndex],
                        signDegree: moonSignDegree,
                        nakshatraIndex: moonObj.nakshatraIndex,
                        nakshatraName: moonObj.nakshatraName,
                        nakshatraPada: moonObj.nakshatraPada,
                        basicC36Value,
                        basicC36Bengali,
                        formattedString: formatBengaliPositionString('mo', moonObj.nakshatraIndex, moonSignIndex, moonSignDegree),
                      };

                      // Calculate Ayanamsha matching Excel =Value!J23: 24° 13' 34.08''
                      const ayanamsaVal = chartData.ayanamsa ?? 24.2261;
                      const ayanamsaDeg = Math.floor(ayanamsaVal);
                      const ayanamsaMin = Math.floor((ayanamsaVal % 1) * 60);
                      const ayanamsaSecRaw = (((ayanamsaVal % 1) * 60) % 1) * 60;
                      const ayanamsaSecFormatted = (ayanamsaSecRaw < 10 ? '0' : '') + ayanamsaSecRaw.toFixed(2);

                      // Standard DMS matching Excel =Value!J23: 24° 13' 34.08''
                      const ayanamsaValueJ23 = `${ayanamsaDeg}° ${ayanamsaMin}' ${ayanamsaSecFormatted}''`;
                      // Bengali representation (Kuthi!AB43): ২৪° ১৩' ৩৪.০৮''
                      const ayanamsaBengali = `${toBengaliDigits(ayanamsaDeg)}° ${toBengaliDigits(ayanamsaMin)}' ${toBengaliDigits(ayanamsaSecFormatted)}''`;

                      setCalcResult({
                        isKuthiChart: true,
                        type: 'Kuthi Generator (Natal Birth Chart)',
                        name: calcForm.name,
                        sex: calcForm.sex,
                        dob: calcForm.dob,
                        tob: calcForm.tob,
                        pob: calcForm.pob,
                        ascendantItem,
                        moonItem,
                        ayanamsaValueJ23,
                        ayanamsaBengali,
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

                    if (mType === 'shani-sade-sati' || activeToolModal.id === 'shani-sade-sati') {
                      const res = calculateSadeSati({
                        name: calcForm.name,
                        gender: calcForm.sex,
                        dob: calcForm.dob,
                        tob: calcForm.tob || '12:00',
                        lat: Number(calcForm.lat) || 24.8170,
                        lng: Number(calcForm.lng) || 93.9368,
                        timezone: Number(calcForm.timezone) || 5.5,
                      });
                      setCalcResult({
                        isSadeSati: true,
                        type: 'Shani Sade Sati Analysis & Remedial Guidance',
                        ...res,
                      });
                      return;
                    }

                    if (mType === 'mangalik-dosh' || activeToolModal.id === 'mangalik-dosh') {
                      const res = calculateManglikDosh({
                        name: calcForm.name,
                        gender: calcForm.sex,
                        dob: calcForm.dob,
                        tob: calcForm.tob || '12:00',
                        lat: Number(calcForm.lat) || 24.8170,
                        lng: Number(calcForm.lng) || 93.9368,
                        timezone: Number(calcForm.timezone) || 5.5,
                      });
                      setCalcResult({
                        isManglikReport: true,
                        type: 'Manglik Dosh & Kuja Bhanga Analysis',
                        ...res,
                      });
                      return;
                    }

                    if (mType === 'kaal-sarp-dosh' || activeToolModal.id === 'kaal-sarp-dosh') {
                      const res = calculateKaalSarpDosh({
                        name: calcForm.name,
                        gender: calcForm.sex,
                        dob: calcForm.dob,
                        tob: calcForm.tob || '12:00',
                        lat: Number(calcForm.lat) || 24.8170,
                        lng: Number(calcForm.lng) || 93.9368,
                        timezone: Number(calcForm.timezone) || 5.5,
                      });
                      setCalcResult({
                        isKaalSarp: true,
                        type: 'Kaal Sarp Dosh Analysis & Shanti Remedies',
                        ...res,
                      });
                      return;
                    }

                    if (mType === 'match-making' || activeToolModal.id === 'match-making') {
                      const res = calculateCoupleMatch({
                        groom: {
                          name: calcForm.name || 'Groom',
                          dob: calcForm.dob,
                          tob: calcForm.tob || '12:00',
                          pob: calcForm.pob,
                          lat: Number(calcForm.lat) || 24.8170,
                          lng: Number(calcForm.lng) || 93.9368,
                        },
                        bride: {
                          name: calcForm.partnerName || 'Bride',
                          dob: calcForm.partnerDob || '1997-08-20',
                          tob: calcForm.partnerTob || '10:30',
                          pob: calcForm.partnerPob || 'Imphal, Manipur',
                          lat: Number(calcForm.partnerLat) || 24.8170,
                          lng: Number(calcForm.partnerLng) || 93.9368,
                        },
                      });
                      setCalcResult({
                        isMatchMaking: true,
                        type: 'Match Making (Ashtakoot Gun Milan & Manglik)',
                        ...res,
                      });
                      return;
                    }

                    if (mType === 'astrology-yoga' || activeToolModal.id === 'astrology-yoga') {
                      const res = calculatePlanetaryYogas({
                        name: calcForm.name,
                        gender: calcForm.sex,
                        dob: calcForm.dob,
                        tob: calcForm.tob || '12:00',
                        lat: Number(calcForm.lat) || 24.8170,
                        lng: Number(calcForm.lng) || 93.9368,
                        timezone: Number(calcForm.timezone) || 5.5,
                      });
                      setCalcResult({
                        isPlanetaryYogas: true,
                        type: 'Planetary Yogas & Classical Vedic Combinations',
                        ...res,
                      });
                      return;
                    }

                    if (mType === 'nga-eeshing' || activeToolModal.id === 'nga-eeshing') {
                      const res = calculateNgaEeshing({
                        groomRashi: Number(calcForm.groomRashi) || 0,
                        brideRashi: Number(calcForm.brideRashi) || 0,
                        groomName: calcForm.name || 'Groom',
                        brideName: calcForm.partnerName || 'Bride',
                      });
                      setCalcResult({
                        isNgaEeshingReport: true,
                        type: 'ঙা-ঈশিং (Nga-Eeshing)',
                        ...res,
                      });
                      return;
                    }
                  }, 500);
                }}
                className="space-y-4 font-sans text-xs"
              >
                {activeToolModal.id === 'yumsharol' ? (
                  <div className="space-y-4">
                    {/* Informative Header / Tradition Note */}
                    <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                      theme === 'dark' ? 'bg-[#0b132b] border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'
                    }`}>
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center shrink-0 text-lg">
                        🏡
                      </div>
                      <div>
                        <span className={`font-extrabold text-xs block ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>
                          Traditional Meetei Yumsharol Engine (House Numerology & Vastu)
                        </span>
                        <p className={`text-[11px] mt-0.5 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                          Calculates time-aware running age down to the birth minute, nakshatra index, sacred constant (15), and traditional Modulo 8 direction house (Dhwaja, Simha, Vrisha, Gaja, etc.).
                        </p>
                      </div>
                    </div>

                    {yumsharolValidationErr && (
                      <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/60 text-red-300 text-xs font-bold">
                        ⚠️ {yumsharolValidationErr}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>
                          Client / Native Full Name
                        </label>
                        <input
                          type="text"
                          value={calcForm.name}
                          onChange={(e) => setCalcForm({ ...calcForm, name: e.target.value })}
                          className={`w-full p-3 rounded-xl font-semibold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                            theme === 'dark' ? 'bg-[#0b132b] border border-[#3a506b] text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-xs'
                          }`}
                          placeholder="e.g. Sanatomba Meitei"
                        />
                      </div>

                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>
                          Date Of Birth (DOB) *
                        </label>
                        <input
                          type="date"
                          required
                          max={new Date().toISOString().split('T')[0]}
                          value={calcForm.dob}
                          onChange={(e) => {
                            setCalcForm({ ...calcForm, dob: e.target.value });
                            setYumsharolValidationErr('');
                          }}
                          className={`w-full p-3 rounded-xl font-semibold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                            theme === 'dark' ? 'bg-[#0b132b] border border-[#3a506b] text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-xs'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>
                          Time Of Birth (TOB) (24-Hour Format)
                        </label>
                        <input
                          type="time"
                          value={calcForm.tob}
                          onChange={(e) => {
                            setCalcForm({ ...calcForm, tob: e.target.value });
                            setYumsharolValidationErr('');
                          }}
                          className={`w-full p-3 rounded-xl font-semibold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                            theme === 'dark' ? 'bg-[#0b132b] border border-[#3a506b] text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-xs'
                          }`}
                        />
                        <span className={`text-[10px] mt-1 block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                          Defaults to 12:00 PM if left blank
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className={`block text-[10px] font-bold uppercase tracking-wider ${
                            theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                          }`}>
                            Birth Nakshatra (1–27) *
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                const chartData = calculatePlanetaryPositions({
                                  name: calcForm.name || 'Native',
                                  gender: calcForm.sex || 'Male',
                                  dateOfBirth: calcForm.dob,
                                  timeOfBirth: calcForm.tob || '12:00',
                                  latitude: Number(calcForm.lat) || 24.8170,
                                  longitude: Number(calcForm.lng) || 93.9368,
                                  timezone: 'Asia/Kolkata',
                                  utcOffset: Number(calcForm.timezone) || 5.5,
                                  ayanamsa: 'Lahiri',
                                });
                                const moon = chartData.planets.find((p: any) => p.id === 'mo');
                                if (moon) {
                                  const moonLong = (moon.signIndex * 30) + moon.signDegree;
                                  const nakInfo = getNakshatraInfo(moonLong);
                                  setCalcForm(prev => ({ ...prev, nakshatra: nakInfo.index + 1 }));
                                }
                              } catch (err) {
                                console.warn('Auto-detect nakshatra failed:', err);
                              }
                            }}
                            className="text-[10px] text-[#d97706] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-[#d97706]" />
                            <span>Auto-detect from Chart</span>
                          </button>
                        </div>

                        <select
                          value={calcForm.nakshatra}
                          onChange={(e) => setCalcForm({ ...calcForm, nakshatra: Number(e.target.value) })}
                          className={`w-full p-3 rounded-xl font-bold text-xs focus:border-[#d97706] focus:outline-none cursor-pointer transition-colors ${
                            theme === 'dark'
                              ? 'bg-[#0b132b] border border-[#3a506b] text-amber-300'
                              : 'bg-white border border-slate-300 text-amber-900 shadow-xs'
                          }`}
                        >
                          {NAKSHATRAS_LIST.map((nak) => (
                            <option key={nak.index} value={nak.index}>
                              {nak.index}. {nak.name} (Lord: {nak.ruler})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Constant Value Setting */}
                    <div className={`p-3.5 rounded-2xl border space-y-2 ${
                      theme === 'dark' ? 'bg-[#0b132b]/70 border-[#3a506b]/60' : 'bg-amber-50/70 border-amber-200 shadow-2xs'
                    }`}>
                      <div className="flex items-center justify-between">
                        <label className={`block text-[10px] font-bold uppercase tracking-wider ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>
                          Traditional Constant Value (Default: 15)
                        </label>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Standard Constant = 15</span>
                      </div>
                      <input
                        type="number"
                        value={calcForm.constantValue}
                        onChange={(e) => setCalcForm({ ...calcForm, constantValue: Number(e.target.value) })}
                        className={`w-full p-2.5 rounded-xl font-mono font-bold text-xs focus:outline-none focus:border-[#d97706] transition-colors ${
                          theme === 'dark' ? 'bg-[#1c2541] border border-[#3a506b] text-white' : 'bg-white border border-slate-300 text-slate-900'
                        }`}
                      />
                      <p className={`text-[10px] leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                        In Manipuri Yumsharol tradition, the constant 15 represents the sacred 15 Lunar Tithis added to running age and birth star before calculating the 8-direction modulus.
                      </p>
                    </div>
                  </div>
                ) : activeToolModal.id === 'match-making' ? (
                  <div className="space-y-4">
                    {/* Informative Header */}
                    <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                      theme === 'dark' ? 'bg-[#0b132b] border-pink-500/30' : 'bg-pink-50 border-pink-200'
                    }`}>
                      <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-500 border border-pink-500/30 flex items-center justify-center shrink-0 text-lg">
                        💍
                      </div>
                      <div>
                        <span className={`font-extrabold text-xs block ${theme === 'dark' ? 'text-pink-400' : 'text-pink-800'}`}>
                          Ashtakoot 36-Gun Milan & Manglik Compatibility Matching
                        </span>
                        <p className={`text-[11px] mt-0.5 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                          Evaluates Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi scores, along with mutual Kuja Samya cancellation.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Groom Column */}
                      <div className={`p-4 rounded-2xl border space-y-3 ${
                        theme === 'dark' ? 'bg-[#0b132b]/80 border-cyan-500/30' : 'bg-sky-50/80 border-sky-200'
                      }`}>
                        <div className="flex items-center gap-2 pb-1 border-b border-cyan-500/20">
                          <span className="text-base">🤵</span>
                          <h4 className={`font-bold text-xs uppercase tracking-wider ${
                            theme === 'dark' ? 'text-cyan-400' : 'text-sky-900'
                          }`}>Groom Profile (বর)</h4>
                        </div>
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                          }`}>
                            Groom Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={calcForm.name}
                            onChange={(e) => setCalcForm({ ...calcForm, name: e.target.value })}
                            className={`w-full p-2.5 rounded-xl font-semibold text-xs focus:border-[#d97706] focus:outline-none ${
                              theme === 'dark' ? 'bg-[#1c2541] border border-[#3a506b] text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                            }`}
                            placeholder="e.g. Sanatomba Meitei"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                              theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                            }`}>
                              Date of Birth *
                            </label>
                            <input
                              type="date"
                              required
                              value={calcForm.dob}
                              onChange={(e) => setCalcForm({ ...calcForm, dob: e.target.value })}
                              className={`w-full p-2 rounded-xl font-semibold text-xs focus:outline-none ${
                                theme === 'dark' ? 'bg-[#1c2541] border border-[#3a506b] text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                              theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                            }`}>
                              Time of Birth *
                            </label>
                            <input
                              type="time"
                              required
                              value={calcForm.tob}
                              onChange={(e) => setCalcForm({ ...calcForm, tob: e.target.value })}
                              className={`w-full p-2 rounded-xl font-semibold text-xs focus:outline-none ${
                                theme === 'dark' ? 'bg-[#1c2541] border border-[#3a506b] text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                              }`}
                            />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                          }`}>
                            Place of Birth (City / Town)
                          </label>
                          <input
                            type="text"
                            value={calcForm.pob}
                            onChange={(e) => setCalcForm({ ...calcForm, pob: e.target.value })}
                            className={`w-full p-2.5 rounded-xl font-semibold text-xs focus:outline-none ${
                              theme === 'dark' ? 'bg-[#1c2541] border border-[#3a506b] text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                            }`}
                            placeholder="Imphal, Manipur"
                          />
                        </div>
                      </div>

                      {/* Bride Column */}
                      <div className={`p-4 rounded-2xl border space-y-3 ${
                        theme === 'dark' ? 'bg-[#0b132b]/80 border-pink-500/30' : 'bg-pink-50/80 border-pink-200'
                      }`}>
                        <div className="flex items-center gap-2 pb-1 border-b border-pink-500/20">
                          <span className="text-base">👰</span>
                          <h4 className={`font-bold text-xs uppercase tracking-wider ${
                            theme === 'dark' ? 'text-pink-400' : 'text-pink-900'
                          }`}>Bride Profile (কন্যা)</h4>
                        </div>
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                          }`}>
                            Bride Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={calcForm.partnerName}
                            onChange={(e) => setCalcForm({ ...calcForm, partnerName: e.target.value })}
                            className={`w-full p-2.5 rounded-xl font-semibold text-xs focus:border-[#d97706] focus:outline-none ${
                              theme === 'dark' ? 'bg-[#1c2541] border border-[#3a506b] text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                            }`}
                            placeholder="e.g. Thoibi Ningthoujam"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                              theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                            }`}>
                              Date of Birth *
                            </label>
                            <input
                              type="date"
                              required
                              value={calcForm.partnerDob}
                              onChange={(e) => setCalcForm({ ...calcForm, partnerDob: e.target.value })}
                              className={`w-full p-2 rounded-xl font-semibold text-xs focus:outline-none ${
                                theme === 'dark' ? 'bg-[#1c2541] border border-[#3a506b] text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                              theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                            }`}>
                              Time of Birth *
                            </label>
                            <input
                              type="time"
                              required
                              value={calcForm.partnerTob}
                              onChange={(e) => setCalcForm({ ...calcForm, partnerTob: e.target.value })}
                              className={`w-full p-2 rounded-xl font-semibold text-xs focus:outline-none ${
                                theme === 'dark' ? 'bg-[#1c2541] border border-[#3a506b] text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                              }`}
                            />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                          }`}>
                            Place of Birth (City / Town)
                          </label>
                          <input
                            type="text"
                            value={calcForm.partnerPob}
                            onChange={(e) => setCalcForm({ ...calcForm, partnerPob: e.target.value })}
                            className={`w-full p-2.5 rounded-xl font-semibold text-xs focus:outline-none ${
                              theme === 'dark' ? 'bg-[#1c2541] border border-[#3a506b] text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                            }`}
                            placeholder="Imphal, Manipur"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      <div>
                        <label className={`block text-[9px] font-bold uppercase mb-1 ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>Latitude (°N)</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={calcForm.lat}
                          onChange={(e) => setCalcForm({ ...calcForm, lat: Number(e.target.value) })}
                          className={`w-full p-2 rounded-xl font-mono text-xs focus:outline-none ${
                            theme === 'dark' ? 'bg-[#0b132b] border border-[#3a506b] text-amber-300' : 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[9px] font-bold uppercase mb-1 ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>Longitude (°E)</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={calcForm.lng}
                          onChange={(e) => setCalcForm({ ...calcForm, lng: Number(e.target.value) })}
                          className={`w-full p-2 rounded-xl font-mono text-xs focus:outline-none ${
                            theme === 'dark' ? 'bg-[#0b132b] border border-[#3a506b] text-amber-300' : 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[9px] font-bold uppercase mb-1 ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>UTC Offset</label>
                        <input
                          type="number"
                          step="0.5"
                          value={calcForm.timezone}
                          onChange={(e) => setCalcForm({ ...calcForm, timezone: Number(e.target.value) })}
                          className={`w-full p-2 rounded-xl font-mono text-xs focus:outline-none ${
                            theme === 'dark' ? 'bg-[#0b132b] border border-[#3a506b] text-amber-300' : 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[9px] font-bold uppercase mb-1 ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>Ayanamsa</label>
                        <input
                          type="text"
                          readOnly
                          value={calcForm.ayanamsa}
                          className={`w-full p-2 rounded-xl font-semibold text-[11px] ${
                            theme === 'dark' ? 'bg-[#0b132b] border border-[#3a506b] text-gray-400' : 'bg-slate-50 border border-slate-300 text-slate-700 font-bold'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ) : activeToolModal.id === 'nga-eeshing' ? (
                  <div className="space-y-4">
                    {/* Informative Header */}
                    <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                      theme === 'dark' ? 'bg-[#0b132b] border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'
                    }`}>
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-500 border border-cyan-500/30 flex items-center justify-center shrink-0 text-lg">
                        🐟
                      </div>
                      <div>
                        <span className={`font-extrabold text-xs block ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-800'}`}>
                          ঙা-ঈশিং (Nga-Eeshing) Matrimonial Compatibility & Ritual Check
                        </span>
                        <p className={`text-[11px] mt-0.5 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                          Traditional Manipuri matrimonial calculation. Select Bride & Groom Janma Rashi (০ - মেষ to ১১ - মীন) to check if ঙা-ঈশিং falls, determine element distribution (ঙা / ঈশিং), and view required remedial rites.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Groom Column */}
                      <div className={`p-4 rounded-2xl border space-y-3 ${
                        theme === 'dark' ? 'bg-[#0b132b]/80 border-cyan-500/30' : 'bg-sky-50/80 border-sky-200'
                      }`}>
                        <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🤵</span>
                            <h4 className={`font-bold text-xs uppercase tracking-wider ${
                              theme === 'dark' ? 'text-cyan-400' : 'text-sky-900'
                            }`}>Groom Profile (নুপা / বর)</h4>
                          </div>
                        </div>
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                          }`}>
                            Groom Full Name
                          </label>
                          <input
                            type="text"
                            value={calcForm.name}
                            onChange={(e) => setCalcForm({ ...calcForm, name: e.target.value })}
                            className={`w-full p-2.5 rounded-xl font-semibold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                              theme === 'dark' ? 'bg-[#1c2541] border border-[#3a506b] text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                            }`}
                            placeholder="Groom Name (নুপাগী মমিং)"
                          />
                        </div>
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                          }`}>
                            Groom Janma Rashi (০ - ১১) *
                          </label>
                          <select
                            value={calcForm.groomRashi ?? 0}
                            onChange={(e) => setCalcForm({ ...calcForm, groomRashi: Number(e.target.value) })}
                            className={`w-full p-2.5 rounded-xl font-bold text-xs focus:border-[#d97706] focus:outline-none cursor-pointer transition-colors ${
                              theme === 'dark' ? 'bg-[#1c2541] border border-[#3a506b] text-cyan-300' : 'bg-white border border-slate-300 text-cyan-900 shadow-2xs'
                            }`}
                          >
                            {RASHI_LIST_NGA_EESHING.map((r) => (
                              <option key={r.index} value={r.index}>
                                {r.nameBengali} ({r.nameEnglish})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Bride Column */}
                      <div className={`p-4 rounded-2xl border space-y-3 ${
                        theme === 'dark' ? 'bg-[#0b132b]/80 border-pink-500/30' : 'bg-pink-50/80 border-pink-200'
                      }`}>
                        <div className="flex items-center justify-between pb-2 border-b border-pink-500/20">
                          <div className="flex items-center gap-2">
                            <span className="text-base">👰</span>
                            <h4 className={`font-bold text-xs uppercase tracking-wider ${
                              theme === 'dark' ? 'text-pink-400' : 'text-pink-900'
                            }`}>Bride Profile (নুপী / কন্যা)</h4>
                          </div>
                        </div>
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                          }`}>
                            Bride Full Name
                          </label>
                          <input
                            type="text"
                            value={calcForm.partnerName}
                            onChange={(e) => setCalcForm({ ...calcForm, partnerName: e.target.value })}
                            className={`w-full p-2.5 rounded-xl font-semibold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                              theme === 'dark' ? 'bg-[#1c2541] border border-[#3a506b] text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                            }`}
                            placeholder="Bride Name (নুপীগী মমিং)"
                          />
                        </div>
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                          }`}>
                            Bride Janma Rashi (০ - ১১) *
                          </label>
                          <select
                            value={calcForm.brideRashi ?? 0}
                            onChange={(e) => setCalcForm({ ...calcForm, brideRashi: Number(e.target.value) })}
                            className={`w-full p-2.5 rounded-xl font-bold text-xs focus:border-[#d97706] focus:outline-none cursor-pointer transition-colors ${
                              theme === 'dark' ? 'bg-[#1c2541] border border-[#3a506b] text-pink-300' : 'bg-white border border-slate-300 text-pink-900 shadow-2xs'
                            }`}
                          >
                            {RASHI_LIST_NGA_EESHING.map((r) => (
                              <option key={r.index} value={r.index}>
                                {r.nameBengali} ({r.nameEnglish})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Standard Full Natal Birth Form for Shani Sade Sati, Manglik Dosh, Kaal Sarp Dosh, Planetary Yogas, and Kuthi Generator */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={calcForm.name}
                          onChange={(e) => setCalcForm({ ...calcForm, name: e.target.value })}
                          className={`w-full p-3 rounded-xl font-semibold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                            theme === 'dark'
                              ? 'bg-[#0b132b] border border-[#3a506b] text-white'
                              : 'bg-white border border-slate-300 text-slate-900 shadow-xs'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>
                          Sex / Gender *
                        </label>
                        <select
                          value={calcForm.sex}
                          onChange={(e) => setCalcForm({ ...calcForm, sex: e.target.value })}
                          className={`w-full p-3 rounded-xl font-bold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                            theme === 'dark'
                              ? 'bg-[#0b132b] border border-[#3a506b] text-amber-300'
                              : 'bg-white border border-slate-300 text-slate-900 shadow-xs'
                          }`}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>
                          Date Of Birth *
                        </label>
                        <input
                          type="date"
                          required
                          value={calcForm.dob}
                          onChange={(e) => setCalcForm({ ...calcForm, dob: e.target.value })}
                          className={`w-full p-3 rounded-xl font-semibold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                            theme === 'dark'
                              ? 'bg-[#0b132b] border border-[#3a506b] text-white'
                              : 'bg-white border border-slate-300 text-slate-900 shadow-xs'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>
                          Time Of Birth *
                        </label>
                        <input
                          type="time"
                          required
                          value={calcForm.tob}
                          onChange={(e) => setCalcForm({ ...calcForm, tob: e.target.value })}
                          className={`w-full p-3 rounded-xl font-semibold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                            theme === 'dark'
                              ? 'bg-[#0b132b] border border-[#3a506b] text-white'
                              : 'bg-white border border-slate-300 text-slate-900 shadow-xs'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                      }`}>
                        Place Of Birth (City / Town) *
                      </label>
                      <input
                        type="text"
                        required
                        value={calcForm.pob}
                        onChange={(e) => setCalcForm({ ...calcForm, pob: e.target.value })}
                        className={`w-full p-3 rounded-xl font-semibold text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-[#0b132b] border border-[#3a506b] text-white'
                            : 'bg-white border border-slate-300 text-slate-900 shadow-xs'
                        }`}
                        placeholder="e.g. Imphal, Manipur"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className={`block text-[9px] font-bold uppercase mb-1 ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>Latitude (°N)</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={calcForm.lat}
                          onChange={(e) => setCalcForm({ ...calcForm, lat: Number(e.target.value) })}
                          className={`w-full p-2.5 rounded-xl font-mono text-xs focus:outline-none transition-colors ${
                            theme === 'dark'
                              ? 'bg-[#0b132b] border border-[#3a506b] text-amber-300'
                              : 'bg-white border border-slate-300 text-slate-900 shadow-xs'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[9px] font-bold uppercase mb-1 ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>Longitude (°E)</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={calcForm.lng}
                          onChange={(e) => setCalcForm({ ...calcForm, lng: Number(e.target.value) })}
                          className={`w-full p-2.5 rounded-xl font-mono text-xs focus:outline-none transition-colors ${
                            theme === 'dark'
                              ? 'bg-[#0b132b] border border-[#3a506b] text-amber-300'
                              : 'bg-white border border-slate-300 text-slate-900 shadow-xs'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[9px] font-bold uppercase mb-1 ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>UTC Offset</label>
                        <input
                          type="number"
                          step="0.5"
                          value={calcForm.timezone}
                          onChange={(e) => setCalcForm({ ...calcForm, timezone: Number(e.target.value) })}
                          className={`w-full p-2.5 rounded-xl font-mono text-xs focus:outline-none transition-colors ${
                            theme === 'dark'
                              ? 'bg-[#0b132b] border border-[#3a506b] text-amber-300'
                              : 'bg-white border border-slate-300 text-slate-900 shadow-xs'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[9px] font-bold uppercase mb-1 ${
                          theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-800'
                        }`}>Ayanamsa</label>
                        <input
                          type="text"
                          readOnly
                          value={calcForm.ayanamsa}
                          className={`w-full p-2.5 rounded-xl font-semibold text-[11px] ${
                            theme === 'dark'
                              ? 'bg-[#0b132b] border border-[#3a506b] text-gray-400'
                              : 'bg-slate-50 border border-slate-300 text-slate-700 font-bold'
                          }`}
                        />
                      </div>
                    </div>
                  </>
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
                <div className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 transition-colors ${
                  theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#faf8f4] border-[#f3e8d2] shadow-xs'
                }`}>
                  {/* Left: Native & Birth Details */}
                  <div className="space-y-1">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase border inline-block mb-1.5 ${
                      theme === 'dark'
                        ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}>
                      NATAL KUTHI REPORT GENERATED
                    </span>
                    <h4 className={`text-xl font-serif font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {calcResult.name} ({calcResult.sex})
                    </h4>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      DOB: {calcResult.dob} | TOB: {calcResult.tob} | POB: {calcResult.pob}
                    </p>
                  </div>

                  {/* Middle: Rashi Name & Basic!C36 Position Value */}
                  {calcResult.moonItem && (
                    <div className={`text-center px-4 py-2.5 rounded-xl border space-y-1 shadow-xs ${
                      theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-amber-50/80 border-amber-300'
                    }`}>
                      <span className={`block text-[10px] uppercase font-bold tracking-wider ${
                        theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-800'
                      }`}>
                        চন্দ্র রাশি (Janma Rashi)
                      </span>
                      <div className="space-y-0.5">
                        <span className={`font-serif font-extrabold text-sm block tracking-wide ${
                          theme === 'dark' ? 'text-amber-300' : 'text-amber-950'
                        }`}>
                          {calcResult.moonItem.basicC36Bengali}
                        </span>
                        <span className={`text-[10px] font-mono block ${
                          theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          [=Basic!C36: {calcResult.moonItem.basicC36Value}]
                        </span>
                      </div>
                      <span className={`text-[11px] block font-bold ${
                        theme === 'dark' ? 'text-gray-200' : 'text-slate-800'
                      }`}>
                        Rashi: {calcResult.moonItem.signName}
                      </span>
                    </div>
                  )}

                  {/* Right: Lagna Position */}
                  <div className={`text-left md:text-right px-4 py-2.5 rounded-xl border space-y-1 ${
                    theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-amber-50 border-amber-300'
                  }`}>
                    <span className={`block text-[10px] uppercase font-bold ${
                      theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                    }`}>
                      Lagna Position Format
                    </span>
                    <span className={`font-serif font-bold text-sm block ${
                      theme === 'dark' ? 'text-amber-300' : 'text-amber-900'
                    }`}>
                      {calcResult.ascendantItem.formattedString}
                    </span>
                    <span className={`text-[11px] block font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Lagna Rashi: {calcResult.ascendantItem.signName}
                    </span>
                  </div>
                </div>

                {/* AYANAMSHA CARD (In between Header Banner and Charts) */}
                {calcResult.ayanamsaBengali && (
                  <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#0e172a] border-[#3a506b]/80 shadow-md'
                      : 'bg-gradient-to-r from-amber-50/80 via-[#fffdf9] to-amber-50/80 border-amber-200/80 shadow-xs'
                  }`}>
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-lg text-amber-500 shrink-0">
                        📐
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            theme === 'dark'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            অয়নাংশীয় (Ayanamsha)
                          </span>
                          <span className={`text-[11px] font-medium ${
                            theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                          }`}>
                            লাহিড়ী (Chitrapaksha Lahiri)
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          সৌরসিদ্ধান্ত ও চিত্রাপক্ষীয় অয়নচলন বিবরণ
                        </p>
                      </div>
                    </div>

                    <div className={`px-5 py-2 rounded-xl border text-center sm:text-right space-y-0.5 ${
                      theme === 'dark'
                        ? 'bg-[#1c2541] border-[#3a506b]'
                        : 'bg-white border-amber-300 shadow-xs'
                    }`}>
                      <span className={`font-serif font-black text-base sm:text-lg tracking-wider block ${
                        theme === 'dark' ? 'text-amber-300' : 'text-amber-900'
                      }`}>
                        {calcResult.ayanamsaBengali}
                      </span>
                      <span className={`text-[11px] font-mono font-medium block ${
                        theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        =Value!J23: {calcResult.ayanamsaValueJ23}
                      </span>
                    </div>
                  </div>
                )}

                {/* SIDE-BY-SIDE D1 & D9 CHARTS (Bengali / Eastern Grid Style) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* D1 RASHI CHART */}
                  <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 text-center transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-[#f3e8d2] shadow-sm'
                  }`}>
                    <div className={`flex items-center justify-between border-b pb-2 ${
                      theme === 'dark' ? 'border-[#3a506b]/60' : 'border-[#f3e8d2]'
                    }`}>
                      <h5 className={`font-serif font-bold text-base ${
                        theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-900'
                      }`}>
                        D1 Rashi Chart (Lagna)
                      </h5>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        theme === 'dark'
                          ? 'text-amber-400 bg-amber-950/50 border border-amber-500/30'
                          : 'text-amber-800 bg-amber-100 border border-amber-300'
                      }`}>
                        Bengali Grid Style
                      </span>
                    </div>
                    <div className="flex justify-center pt-2 overflow-x-auto">
                      <BengaliChart
                        planets={calcResult.d1MappedPlanets}
                        ascendantSign={calcResult.ascSignIndex}
                        title="D1 Rashi Chart (Lagna)"
                        theme={theme}
                      />
                    </div>
                  </div>

                  {/* D9 NAVAMSHA CHART */}
                  <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 text-center transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-[#f3e8d2] shadow-sm'
                  }`}>
                    <div className={`flex items-center justify-between border-b pb-2 ${
                      theme === 'dark' ? 'border-[#3a506b]/60' : 'border-[#f3e8d2]'
                    }`}>
                      <h5 className={`font-serif font-bold text-base ${
                        theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-900'
                      }`}>
                        D9 Navamsha Chart
                      </h5>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        theme === 'dark'
                          ? 'text-purple-300 bg-purple-950/50 border border-purple-500/30'
                          : 'text-purple-800 bg-purple-100 border border-purple-300'
                      }`}>
                        Bengali Grid Style
                      </span>
                    </div>
                    <div className="flex justify-center pt-2 overflow-x-auto">
                      <BengaliChart
                        planets={calcResult.d9MappedPlanets}
                        ascendantSign={calcResult.navAscSignIndex}
                        title="D9 Navamsha Chart"
                        theme={theme}
                      />
                    </div>
                  </div>
                </div>

                {/* TRADITIONAL BENGALI PANCHANGA & SAKABTA DETAILS CARD */}
                {calcResult.panchangaDetails && (
                  <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-[#f3e8d2] shadow-sm'
                  }`}>
                    <div className={`flex items-center justify-between border-b pb-2 ${
                      theme === 'dark' ? 'border-[#3a506b]/60' : 'border-[#f3e8d2]'
                    }`}>
                      <h5 className={`font-serif font-bold text-sm uppercase tracking-wider ${
                        theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-900'
                      }`}>
                        শকাব্দ ও বাংলা তারিখ এবং জন্ম পঞ্চাঙ্গ বিবরণ (Birth Panchanga & Era Details)
                      </h5>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        theme === 'dark'
                          ? 'bg-[#d97706]/20 text-[#fbbf24] border border-[#d97706]/40'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {calcResult.panchangaDetails.sakabta}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className={`p-3 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]/60' : 'bg-[#faf8f4] border-[#f3e8d2]'
                      }`}>
                        <span className={`block text-[10px] font-bold uppercase ${
                          theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          শকাব্দ (Sakabta Era)
                        </span>
                        <span className={`font-bold text-sm pt-0.5 block ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                          {calcResult.panchangaDetails.sakabta}
                        </span>
                      </div>
                      <div className={`p-3 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]/60' : 'bg-[#faf8f4] border-[#f3e8d2]'
                      }`}>
                        <span className={`block text-[10px] font-bold uppercase ${
                          theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          বাংলা তারিখ (Bengali Date)
                        </span>
                        <span className={`font-bold text-xs pt-0.5 block ${
                          theme === 'dark' ? 'text-amber-300' : 'text-amber-700'
                        }`}>
                          {calcResult.panchangaDetails.bengaliDateStr}
                        </span>
                      </div>
                      <div className={`p-3 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]/60' : 'bg-[#faf8f4] border-[#f3e8d2]'
                      }`}>
                        <span className={`block text-[10px] font-bold uppercase ${
                          theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          জন্ম তিথি (Tithi)
                        </span>
                        <span className={`font-bold text-xs pt-0.5 block ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                          {calcResult.panchangaDetails.tithiName}
                        </span>
                      </div>
                      <div className={`p-3 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]/60' : 'bg-[#faf8f4] border-[#f3e8d2]'
                      }`}>
                        <span className={`block text-[10px] font-bold uppercase ${
                          theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          জন্ম যোগ (Yoga)
                        </span>
                        <span className={`font-bold text-xs pt-0.5 block ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                          {calcResult.panchangaDetails.yogaName}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs pt-1">
                      <div className={`p-2.5 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2541]/70 border-[#3a506b]/40' : 'bg-[#fffdfa] border-[#f3e8d2]'
                      }`}>
                        <span className={`block text-[9px] font-bold uppercase ${
                          theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          করণ (Karana)
                        </span>
                        <span className={`font-semibold ${
                          theme === 'dark' ? 'text-gray-200' : 'text-slate-800'
                        }`}>
                          {calcResult.panchangaDetails.karanaName}
                        </span>
                      </div>
                      <div className={`p-2.5 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2541]/70 border-[#3a506b]/40' : 'bg-[#fffdfa] border-[#f3e8d2]'
                      }`}>
                        <span className={`block text-[9px] font-bold uppercase ${
                          theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          গণ (Gana)
                        </span>
                        <span className={`font-semibold ${
                          theme === 'dark' ? 'text-gray-200' : 'text-slate-800'
                        }`}>
                          {calcResult.panchangaDetails.gana}
                        </span>
                      </div>
                      <div className={`p-2.5 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2541]/70 border-[#3a506b]/40' : 'bg-[#fffdfa] border-[#f3e8d2]'
                      }`}>
                        <span className={`block text-[9px] font-bold uppercase ${
                          theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          যোনি (Yoni)
                        </span>
                        <span className={`font-semibold ${
                          theme === 'dark' ? 'text-gray-200' : 'text-slate-800'
                        }`}>
                          {calcResult.panchangaDetails.yoni}
                        </span>
                      </div>
                      <div className={`p-2.5 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2541]/70 border-[#3a506b]/40' : 'bg-[#fffdfa] border-[#f3e8d2]'
                      }`}>
                        <span className={`block text-[9px] font-bold uppercase ${
                          theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          নাড়ি (Nadi)
                        </span>
                        <span className={`font-semibold ${
                          theme === 'dark' ? 'text-gray-200' : 'text-slate-800'
                        }`}>
                          {calcResult.panchangaDetails.nadi}
                        </span>
                      </div>
                      <div className={`p-2.5 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2541]/70 border-[#3a506b]/40' : 'bg-[#fffdfa] border-[#f3e8d2]'
                      }`}>
                        <span className={`block text-[9px] font-bold uppercase ${
                          theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          বর্ণ ও বশ্য
                        </span>
                        <span className={`font-semibold ${
                          theme === 'dark' ? 'text-gray-200' : 'text-slate-800'
                        }`}>
                          {calcResult.panchangaDetails.varna} / {calcResult.panchangaDetails.vashya}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* DASHA BALANCES AT BIRTH CARD (VIMSHOTTARI, ASHTOTTARI, YOGINI) */}
                {calcResult.panchangaDetails && (
                  <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-[#f3e8d2] shadow-sm'
                  }`}>
                    <span className={`text-xs font-serif font-bold uppercase tracking-wider block ${
                      theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-900'
                    }`}>
                      Balance Of Dasha
                    </span>

                    <div className="space-y-2.5 text-xs">
                      {/* Vimshottari Dasha Balance */}
                      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
                        theme === 'dark' ? 'bg-[#1c2541] border-amber-500/30' : 'bg-amber-50/80 border-amber-300'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            theme === 'dark' ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-200 text-amber-900'
                          }`}>
                            বিংশোত্তরী দশা
                          </span>
                          <span className={`font-bold text-xs ${
                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                          }`}>
                            {calcResult.panchangaDetails.vimshottariDasha.lordBengali} ({calcResult.panchangaDetails.vimshottariDasha.lordName})
                          </span>
                        </div>
                        <span className={`font-mono font-bold text-sm tracking-wide ${
                          theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
                        }`}>
                          {calcResult.panchangaDetails.vimshottariDasha.formattedString}
                        </span>
                      </div>

                      {/* Ashtottari Dasha Balance */}
                      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
                        theme === 'dark' ? 'bg-[#1c2541] border-purple-500/30' : 'bg-purple-50/80 border-purple-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-200 text-purple-900'
                          }`}>
                            অষ্টোত্তরী দশা
                          </span>
                          <span className={`font-bold text-xs ${
                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                          }`}>
                            {calcResult.panchangaDetails.ashtottariDasha.lordBengali} ({calcResult.panchangaDetails.ashtottariDasha.lordName})
                          </span>
                        </div>
                        <span className={`font-mono font-bold text-sm tracking-wide ${
                          theme === 'dark' ? 'text-purple-300' : 'text-purple-900'
                        }`}>
                          {calcResult.panchangaDetails.ashtottariDasha.formattedString}
                        </span>
                      </div>

                      {/* Yogini Dasha Balance */}
                      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
                        theme === 'dark' ? 'bg-[#1c2541] border-teal-500/30' : 'bg-teal-50/80 border-teal-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            theme === 'dark' ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-200 text-teal-900'
                          }`}>
                            যোগিনী দশা
                          </span>
                          <span className={`font-bold text-xs ${
                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                          }`}>
                            {calcResult.panchangaDetails.yoginiDasha.nameBengali} ({calcResult.panchangaDetails.yoginiDasha.name})
                          </span>
                        </div>
                        <span className={`font-mono font-bold text-sm tracking-wide ${
                          theme === 'dark' ? 'text-teal-300' : 'text-teal-900'
                        }`}>
                          {calcResult.panchangaDetails.yoginiDasha.formattedString}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* PLANETARY LONGITUDES & POSITIONS TABLE (Format: রবি (১২) ০।১২।২৩।১২) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold uppercase ${
                      theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-900'
                    }`}>
                      Planetary Longitudes & Positions (Format: গ্রহ (নক্ষত্র) রাশি।ডিগ্রী।মিনিট।সেকেন্ড)
                    </span>
                  </div>
                  <div className={`border rounded-2xl overflow-hidden text-xs ${
                    theme === 'dark' ? 'border-[#3a506b]' : 'border-[#f3e8d2]'
                  }`}>
                    <table className="w-full text-left">
                      <thead className={`uppercase font-bold text-[10px] ${
                        theme === 'dark' ? 'bg-[#0b132b] text-[#e0a96d]' : 'bg-amber-100 text-amber-900'
                      }`}>
                        <tr>
                          <th className="p-3">Planet</th>
                          <th className="p-3">Position Format (গ্রহ (নক্ষত্র) রাশি।ডিগ্রী।মিনিট।সেকেন্ড)</th>
                          <th className="p-3">Rashi Sign (0-11)</th>
                          <th className="p-3">Nakshatra & Pada</th>
                          <th className="p-3">House</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${
                        theme === 'dark' ? 'divide-[#3a506b]/40' : 'divide-[#f3e8d2]'
                      }`}>
                        {/* ASCENDANT (LAGNA) ROW */}
                        <tr className={`font-bold border-b ${
                          theme === 'dark' ? 'bg-amber-950/30 border-[#3a506b]' : 'bg-amber-50 border-[#f3e8d2]'
                        }`}>
                          <td className={`p-3 flex items-center gap-1.5 ${
                            theme === 'dark' ? 'text-amber-300' : 'text-amber-900'
                          }`}>
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                            <span>{calcResult.ascendantItem.name}</span>
                          </td>
                          <td className={`p-3 font-mono font-bold ${
                            theme === 'dark' ? 'text-amber-300' : 'text-amber-900'
                          }`}>
                            {calcResult.ascendantItem.formattedString}
                          </td>
                          <td className={`p-3 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                            {calcResult.ascendantItem.signName}
                          </td>
                          <td className={`p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                            {calcResult.ascendantItem.nakshatraName} (Pada {calcResult.ascendantItem.nakshatraPada})
                          </td>
                          <td className={`p-3 font-extrabold ${
                            theme === 'dark' ? 'text-amber-300' : 'text-amber-900'
                          }`}>
                            House 1 (Lagna)
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              theme === 'dark'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-amber-100 text-amber-900 border-amber-300'
                            }`}>
                              Lagna Point
                            </span>
                          </td>
                        </tr>

                        {/* 9 PLANETS ROWS */}
                        {calcResult.planets.map((p: any) => (
                          <tr key={p.id} className={`transition-colors ${
                            theme === 'dark' ? 'hover:bg-[#0b132b]/40' : 'hover:bg-amber-50/50 bg-white'
                          }`}>
                            <td className={`p-3 font-bold flex items-center gap-1.5 ${
                              theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                              <span>{p.bengaliName} ({p.name})</span>
                            </td>
                            <td className={`p-3 font-mono font-bold ${
                              theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
                            }`}>
                              {p.formattedString}
                            </td>
                            <td className={`p-3 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                              {p.bengaliRashiName}
                            </td>
                            <td className={`p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                              {p.nakshatraName} (Pada {p.nakshatraPada})
                            </td>
                            <td className={`p-3 font-bold ${
                              theme === 'dark' ? 'text-gray-200' : 'text-slate-800'
                            }`}>
                              House {p.houseNumber}
                            </td>
                            <td className="p-3">
                              {p.isRetrograde ? (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                  theme === 'dark'
                                    ? 'bg-red-950/60 text-red-400 border-red-500/30'
                                    : 'bg-red-100 text-red-700 border-red-200'
                                }`}>
                                  Retrograde (ব / R)
                                </span>
                              ) : (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                  theme === 'dark'
                                    ? 'bg-green-950/60 text-green-400 border-green-500/30'
                                    : 'bg-green-100 text-green-800 border-green-200'
                                }`}>
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

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="py-3.5 px-5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Print Page</span>
                  </button>
                  <button
                    onClick={() => setCalcResult(null)}
                    className={`py-3.5 px-6 rounded-xl font-bold text-xs border cursor-pointer transition-colors ${
                      theme === 'dark'
                        ? 'bg-[#0b132b] hover:bg-[#334155] text-gray-300 border-[#3a506b]'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                    }`}
                  >
                    Calculate Another Kuthi
                  </button>
                </div>
              </div>
            )}

            {/* Results Output for Yumsharol Traditional Vastu */}
            {calcResult && calcResult.isYumsharol && (
              <div className="space-y-6 font-sans text-xs">
                {/* Top Banner with Traditional House & Direction */}
                <div className={`p-6 rounded-3xl border text-left space-y-4 relative overflow-hidden transition-colors ${
                  calcResult.directionInfo.quality === 'Auspicious'
                    ? (theme === 'dark' ? 'bg-gradient-to-br from-emerald-950/70 via-[#0b132b] to-[#0b132b] border-emerald-500/40' : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 border-emerald-300 text-slate-900 shadow-sm')
                    : calcResult.directionInfo.quality === 'Inauspicious'
                    ? (theme === 'dark' ? 'bg-gradient-to-br from-rose-950/70 via-[#0b132b] to-[#0b132b] border-rose-500/40' : 'bg-gradient-to-br from-rose-50 via-white to-rose-100/50 border-rose-300 text-slate-900 shadow-sm')
                    : (theme === 'dark' ? 'bg-gradient-to-br from-amber-950/70 via-[#0b132b] to-[#0b132b] border-amber-500/40' : 'bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-amber-300 text-slate-900 shadow-sm')
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl shadow-lg shrink-0 ${
                        theme === 'dark' ? 'bg-[#0b132b] border-white/10' : 'bg-white border-slate-200'
                      }`}>
                        {calcResult.directionInfo.symbol}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            theme === 'dark'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}>
                            YUMSHAROL HOUSE INDEX #{calcResult.traditionalIndex} OF 8
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            calcResult.directionInfo.quality === 'Auspicious'
                              ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border border-emerald-300')
                              : (theme === 'dark' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-rose-100 text-rose-800 border border-rose-300')
                          }`}>
                            {calcResult.directionInfo.quality === 'Auspicious' ? '✓ Auspicious Griha' : '⚠ Caution / Remedial Rituals Advised'}
                          </span>
                        </div>
                        <h4 className={`font-serif font-bold text-2xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {calcResult.directionInfo.name}
                        </h4>
                        <p className={`text-xs font-semibold mt-0.5 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-800'}`}>
                          {calcResult.directionInfo.manipuriName} • Direction: {calcResult.directionInfo.direction} ({calcResult.directionInfo.directionManipuri})
                        </p>
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-2xl border text-right shrink-0 ${
                      theme === 'dark' ? 'bg-[#1c2541]/90 border-white/10' : 'bg-white/95 border-slate-200 shadow-xs'
                    }`}>
                      <span className={`block text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        Traditional Direction
                      </span>
                      <strong className="text-lg text-emerald-600 dark:text-emerald-400 font-mono block">
                        {calcResult.directionInfo.direction}
                      </strong>
                      <span className={`text-[11px] block ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                        {calcResult.directionInfo.directionManipuri}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4 KEY METRICS TILES */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className={`p-3.5 rounded-2xl border transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className={`block text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                      1. Running Age
                    </span>
                    <span className="text-xl font-bold font-mono text-[#d97706] dark:text-[#fbbf24] block mt-1">
                      {calcResult.runningAge}th Year
                    </span>
                    <span className={`text-[10px] block mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                      Anniversary precise
                    </span>
                  </div>

                  <div className={`p-3.5 rounded-2xl border transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className={`block text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                      2. Birth Nakshatra
                    </span>
                    <span className={`text-sm font-bold block mt-1 truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      #{calcResult.nakshatra} {calcResult.nakshatraName}
                    </span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium block mt-0.5">
                      Ruler: {calcResult.nakshatraRuler}
                    </span>
                  </div>

                  <div className={`p-3.5 rounded-2xl border transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className={`block text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                      3. Constant Value
                    </span>
                    <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 block mt-1">
                      {calcResult.constantValue}
                    </span>
                    <span className={`text-[10px] block mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                      Sacred 15 Tithis
                    </span>
                  </div>

                  <div className={`p-3.5 rounded-2xl border transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className={`block text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                      4. Modulo 8 Result
                    </span>
                    <span className="text-xl font-bold font-mono text-sky-700 dark:text-cyan-400 block mt-1">
                      Index {calcResult.traditionalIndex}
                    </span>
                    <span className={`text-[10px] block mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                      standardMod = {calcResult.standardMod}
                    </span>
                  </div>
                </div>

                {/* RESULT SECTION WITH CENTERED BIG REMAINDER AND TRADITIONAL MEETEI VERSE */}
                <div className={`p-6 rounded-3xl border space-y-4 text-center transition-colors ${
                  theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-amber-50/70 border-amber-300 shadow-sm'
                }`}>
                  <div className={`flex items-center justify-between pb-3 border-b ${
                    theme === 'dark' ? 'border-[#3a506b]/60' : 'border-amber-200'
                  }`}>
                    <span className={`text-xs font-serif font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-900'
                    }`}>
                      Result
                    </span>
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      theme === 'dark' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}>
                      Yumsharol Remainder
                    </span>
                  </div>

                  {/* Remainder Centered with Big Number */}
                  <div className="py-2 space-y-1">
                    <span className={`text-xs uppercase font-extrabold tracking-widest block ${
                      theme === 'dark' ? 'text-gray-400' : 'text-amber-900/70'
                    }`}>
                      Remainder
                    </span>
                    <div className={`text-6xl sm:text-7xl font-black font-mono tracking-tight ${
                      theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-800'
                    }`}>
                      {calcResult.standardMod}
                    </div>
                  </div>

                  {/* Traditional Manipuri Verse for this Remainder */}
                  <div className={`p-5 rounded-2xl border max-w-xl mx-auto text-center shadow-inner ${
                    theme === 'dark' ? 'bg-[#1c2541] border-amber-500/30' : 'bg-white border-amber-300'
                  }`}>
                    <p className={`font-blipi text-lg sm:text-xl font-normal leading-relaxed tracking-wide ${
                      theme === 'dark' ? 'text-amber-200' : 'text-amber-950'
                    }`}>
                      {calcResult.remainderPrediction || (
                        <>
                          {calcResult.standardMod === 0 && '0 El§a lzjaen| Kuidzmo_+a feo_| Amz-yah~eTaz k=mem| iSba nz@|'}
                          {calcResult.standardMod === 1 && '1 El§a ifralda E~ley, ln-Tum caR~K\\il|'}
                          {calcResult.standardMod === 2 && '2 El§a E~mKuin, feo_, E~meh; lazepak nzgiL| Ec(I yum oh~rbsu h~muz Zmxmk mih laz@| f\\et|'}
                          {calcResult.standardMod === 3 && '3 El§a EnazSain, mah~ pakpa caR~K\\pa, yumTuna Saba Zm@, E~fey|'}
                          {calcResult.standardMod === 4 && '4 El§a lmHh~in, El;iSz taNduna Etak@, waeTak laneTak@, maz tak@|'}
                          {calcResult.standardMod === 5 && '5 El§id ih-yah~ Apan-Arz Zmxmk fze~j@, ln tuzh~, yamxa E~f@|'}
                          {calcResult.standardMod === 6 && '6 El§id Elalaen| Ana-Aeyk Etah~na nz@| Ku\\#-Ku\\lah~na ESakpa pnba, yumSaba, R~#ba mIga, yu§uga K\\ne~cnba nz@|'}
                          {calcResult.standardMod === 7 && '7 El§id Samuen| mana minl nah~dna yum Saba Zme~j@| ln-Tum caR~K\\il|'}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* TRADITIONAL MANIPURI SIGNIFICANCE & VASTU ADVICE */}
                <div className={`p-5 rounded-2xl border space-y-3 text-xs transition-colors ${
                  theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <span className={`text-xs font-serif font-bold uppercase tracking-wider block ${
                    theme === 'dark' ? 'text-[#e0a96d]' : 'text-amber-900'
                  }`}>
                    Traditional Yumsharol Significance & Vastu Guidance
                  </span>
                  <div className={`p-4 rounded-xl border space-y-2 ${
                    theme === 'dark' ? 'bg-[#1c2541] border-amber-500/30' : 'bg-amber-50/70 border-amber-200'
                  }`}>
                    <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>
                      <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Significance:</strong> {calcResult.directionInfo.significance}
                    </p>
                    <p className={`leading-relaxed pt-1.5 border-t ${
                      theme === 'dark' ? 'text-amber-200 border-[#3a506b]/40' : 'text-amber-950 border-amber-200'
                    }`}>
                      <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Recommendation:</strong> {calcResult.directionInfo.recommendation}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Print / Save Yumsharol Report PDF</span>
                  </button>
                  <button
                    onClick={() => setCalcResult(null)}
                    className={`py-3 px-5 rounded-xl font-bold text-xs border cursor-pointer transition-colors ${
                      theme === 'dark'
                        ? 'bg-[#0b132b] hover:bg-[#334155] text-gray-300 border-[#3a506b]'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                    }`}
                  >
                    Calculate Another Profile
                  </button>
                </div>
              </div>
            )}

            {/* Results Output for Shani Sade Sati */}
            {calcResult && calcResult.isSadeSati && (
              <div className="space-y-6 font-sans text-xs">
                {/* Header Card */}
                <div className={`p-6 rounded-3xl border text-left space-y-4 relative overflow-hidden transition-colors ${
                  calcResult.severity === 'None'
                    ? (theme === 'dark' ? 'bg-gradient-to-br from-emerald-950/70 via-[#0b132b] to-[#0b132b] border-emerald-500/40' : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 border-emerald-300 text-slate-900 shadow-sm')
                    : calcResult.severity === 'High'
                    ? (theme === 'dark' ? 'bg-gradient-to-br from-rose-950/70 via-[#0b132b] to-[#0b132b] border-rose-500/40' : 'bg-gradient-to-br from-rose-50 via-white to-rose-100/50 border-rose-300 text-slate-900 shadow-sm')
                    : (theme === 'dark' ? 'bg-gradient-to-br from-sky-950/70 via-[#0b132b] to-[#0b132b] border-sky-500/40' : 'bg-gradient-to-br from-sky-50 via-white to-sky-100/50 border-sky-300 text-slate-900 shadow-sm')
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl shadow-lg shrink-0 ${
                        theme === 'dark' ? 'bg-[#0b132b] border-white/10' : 'bg-white border-slate-200'
                      }`}>
                        🪐
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            theme === 'dark' ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' : 'bg-sky-100 text-sky-900 border-sky-300'
                          }`}>
                            SHANI SADE SATI & DHAIYA REPORT
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            calcResult.severity === 'High' ? (theme === 'dark' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-rose-100 text-rose-800 border border-rose-300') :
                            calcResult.severity === 'Moderate' ? (theme === 'dark' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-100 text-amber-800 border border-amber-300') :
                            calcResult.severity === 'Mild' ? (theme === 'dark' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-sky-100 text-sky-800 border border-sky-300') :
                            (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border border-emerald-300')
                          }`}>
                            Severity: {calcResult.severity}
                          </span>
                        </div>
                        <h4 className={`font-serif font-bold text-2xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {calcResult.nativeName}
                        </h4>
                        <p className={`text-xs font-semibold mt-0.5 ${theme === 'dark' ? 'text-sky-200' : 'text-slate-700'}`}>
                          Natal Moon Sign: <span className="text-amber-700 dark:text-amber-300 font-bold">{calcResult.moonSign}</span> ({calcResult.moonDegree.toFixed(2)}°) • Current Transit Saturn: <span className="text-amber-700 dark:text-amber-300 font-bold">{calcResult.currentSaturnSign}</span>
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-2xl border text-right shrink-0 ${
                      theme === 'dark' ? 'bg-[#1c2541]/90 border-white/10' : 'bg-white/95 border-sky-200 shadow-xs'
                    }`}>
                      <span className={`block text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        Transit Status
                      </span>
                      <strong className={`text-base font-bold block mt-0.5 ${
                        calcResult.isSadeSatiActive
                          ? (theme === 'dark' ? 'text-rose-400' : 'text-rose-600')
                          : (theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600')
                      }`}>
                        {calcResult.phase}
                      </strong>
                      <span className={`text-[11px] block ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                        {calcResult.phaseManipuri}
                      </span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    theme === 'dark' ? 'bg-[#0b132b]/80 border-white/10 text-gray-200' : 'bg-white/90 border-sky-200 text-slate-800 shadow-2xs'
                  }`}>
                    <p>{calcResult.statusDescription}</p>
                  </div>
                </div>

                {/* 4 Impact Life Areas Matrix */}
                <div className="space-y-2">
                  <h5 className={`font-serif font-bold text-sm uppercase tracking-wider ${
                    theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-900'
                  }`}>
                    Domain Impacts & Astrological Focus
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {calcResult.impactAreas.map((ia: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border space-y-2 transition-colors ${
                          theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {ia.area}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            ia.status === 'Challenging' ? (theme === 'dark' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-rose-100 text-rose-700 border border-rose-300') :
                            ia.status === 'Caution' ? (theme === 'dark' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-100 text-amber-700 border border-amber-300') :
                            (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-300')
                          }`}>
                            {ia.status}
                          </span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                          {ia.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lifetime Cycle History Table */}
                <div className="space-y-2">
                  <h5 className={`font-serif font-bold text-sm uppercase tracking-wider ${
                    theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-900'
                  }`}>
                    Sade Sati Lifetime Transit Phases
                  </h5>
                  <div className={`overflow-x-auto rounded-2xl border ${
                    theme === 'dark' ? 'border-[#3a506b]/60' : 'border-slate-200 shadow-xs'
                  }`}>
                    <table className="w-full text-left border-collapse">
                      <thead className={`text-[10px] uppercase tracking-wider font-bold ${
                        theme === 'dark' ? 'bg-[#0b132b] text-gray-400' : 'bg-slate-100 text-slate-800'
                      }`}>
                        <tr>
                          <th className="p-3">Phase / Cycle</th>
                          <th className="p-3">Transit Influence</th>
                          <th className="p-3">Estimated Span</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className={`text-xs ${
                        theme === 'dark' ? 'divide-y divide-[#3a506b]/40' : 'divide-y divide-slate-200'
                      }`}>
                        {calcResult.cycleHistory.map((c: any, idx: number) => (
                          <tr
                            key={idx}
                            className={`${
                              c.isCurrent
                                ? (theme === 'dark' ? 'bg-amber-500/10 font-bold' : 'bg-amber-50 font-bold')
                                : (theme === 'dark' ? 'hover:bg-[#1c2541]/50' : 'hover:bg-slate-50 bg-white')
                            }`}
                          >
                            <td className={`p-3 font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {c.phaseName}
                            </td>
                            <td className={`p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                              {c.description}
                            </td>
                            <td className={`p-3 font-mono font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-800'}`}>
                              {c.estimatedYears}
                            </td>
                            <td className="p-3 text-center">
                              {c.isCurrent ? (
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  theme === 'dark' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-rose-100 text-rose-800 border-rose-300'
                                }`}>
                                  Current Active
                                </span>
                              ) : (
                                <span className={theme === 'dark' ? 'text-gray-500 text-[11px]' : 'text-slate-400 text-[11px]'}>—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Authentic Vedic Remedies Card */}
                <div className={`p-5 rounded-2xl border space-y-3.5 transition-colors ${
                  theme === 'dark' ? 'bg-[#0b132b] border-sky-500/30' : 'bg-sky-50/80 border-sky-200 shadow-xs'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🪔</span>
                    <h5 className={`font-serif font-bold text-sm uppercase tracking-wider ${
                      theme === 'dark' ? 'text-sky-400' : 'text-sky-900'
                    }`}>
                      Prescribed Vedic Shanti & Remedial Measures
                    </h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      theme === 'dark' ? 'bg-[#1c2541] border-white/5' : 'bg-white border-sky-200 shadow-2xs'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-sky-300' : 'text-sky-800'}`}>
                        Shani Beej Mantra
                      </span>
                      <p className={`font-mono text-[11px] select-all font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {calcResult.vedicRemedies.mantra}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      theme === 'dark' ? 'bg-[#1c2541] border-white/5' : 'bg-white border-sky-200 shadow-2xs'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-sky-300' : 'text-sky-800'}`}>
                        Deity Worship
                      </span>
                      <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                        {calcResult.vedicRemedies.deity}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      theme === 'dark' ? 'bg-[#1c2541] border-white/5' : 'bg-white border-sky-200 shadow-2xs'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-sky-300' : 'text-sky-800'}`}>
                        Charity & Dana
                      </span>
                      <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                        {calcResult.vedicRemedies.charity}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      theme === 'dark' ? 'bg-[#1c2541] border-white/5' : 'bg-white border-sky-200 shadow-2xs'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-sky-300' : 'text-sky-800'}`}>
                        Gemstone Guidance
                      </span>
                      <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                        {calcResult.vedicRemedies.gemstoneGuidance}
                      </p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl border text-[11px] ${
                    theme === 'dark' ? 'bg-[#1c2541] border-white/5 text-amber-200' : 'bg-white border-amber-200 text-amber-950 shadow-2xs'
                  }`}>
                    <strong>Daily Practice:</strong> {calcResult.vedicRemedies.dailyPractice}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Print Shani Sade Sati Report</span>
                  </button>
                  <button
                    onClick={() => setCalcResult(null)}
                    className={`py-3 px-5 rounded-xl font-bold text-xs border cursor-pointer transition-colors ${
                      theme === 'dark'
                        ? 'bg-[#0b132b] hover:bg-[#334155] text-gray-300 border-[#3a506b]'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                    }`}
                  >
                    Calculate Another Native
                  </button>
                </div>
              </div>
            )}

            {/* Results Output for Manglik Dosh */}
            {calcResult && (calcResult.isManglikReport || calcResult.type?.includes('Manglik')) && (
              <div className="space-y-6 font-sans text-xs">
                {/* Header Card */}
                <div className={`p-6 rounded-3xl border text-left space-y-4 relative overflow-hidden transition-colors ${
                  calcResult.status?.includes('Clean') || calcResult.status?.includes('Cancelled')
                    ? (theme === 'dark' ? 'bg-gradient-to-br from-emerald-950/70 via-[#0b132b] to-[#0b132b] border-emerald-500/40' : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 border-emerald-300 text-slate-900 shadow-sm')
                    : (theme === 'dark' ? 'bg-gradient-to-br from-rose-950/70 via-[#0b132b] to-[#0b132b] border-rose-500/40' : 'bg-gradient-to-br from-rose-50 via-white to-rose-100/50 border-rose-300 text-slate-900 shadow-sm')
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl shadow-lg shrink-0 ${
                        theme === 'dark' ? 'bg-[#0b132b] border-white/10' : 'bg-white border-slate-200'
                      }`}>
                        🔥
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            theme === 'dark' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-rose-100 text-rose-900 border-rose-300'
                          }`}>
                            KUJA DOSHA (MANGLIK) EVALUATION
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            calcResult.score > 50
                              ? (theme === 'dark' ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' : 'bg-rose-100 text-rose-800 border border-rose-300')
                              : calcResult.score > 0
                              ? (theme === 'dark' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'bg-amber-100 text-amber-800 border border-amber-300')
                              : (theme === 'dark' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-100 text-emerald-800 border border-emerald-300')
                          }`}>
                            Dosha Score: {calcResult.score}%
                          </span>
                        </div>
                        <h4 className={`font-serif font-bold text-2xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {calcResult.nativeName} ({calcResult.gender})
                        </h4>
                        <p className={`text-xs font-semibold mt-0.5 ${theme === 'dark' ? 'text-rose-200' : 'text-slate-700'}`}>
                          Classical Manglik Assessment from Lagna, Chandra, and Shukra
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-2xl border text-right shrink-0 ${
                      theme === 'dark' ? 'bg-[#1c2541]/90 border-white/10' : 'bg-white/95 border-rose-200 shadow-xs'
                    }`}>
                      <span className={`block text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        Overall Verdict
                      </span>
                      <strong className={`text-base font-bold block mt-0.5 ${
                        calcResult.score > 50
                          ? (theme === 'dark' ? 'text-rose-400' : 'text-rose-600')
                          : calcResult.score > 0
                          ? (theme === 'dark' ? 'text-amber-400' : 'text-amber-700')
                          : (theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600')
                      }`}>
                        {calcResult.status}
                      </strong>
                      <span className={`text-[11px] block ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                        {calcResult.statusManipuri}
                      </span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    theme === 'dark' ? 'bg-[#0b132b]/80 border-white/10 text-gray-200' : 'bg-white/90 border-rose-200 text-slate-800 shadow-2xs'
                  }`}>
                    <p>{calcResult.effectsSummary}</p>
                  </div>
                </div>

                {/* 3 Reference Placements (Lagna, Moon, Venus) */}
                <div className="space-y-2">
                  <h5 className={`font-serif font-bold text-sm uppercase tracking-wider ${
                    theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-900'
                  }`}>
                    Mars (Mangal) Placements from 3 Classical Vedic Lagnas
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {calcResult.placements.map((p: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border space-y-2 transition-colors ${
                          theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {p.fromReference}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            p.isDoshaPresent
                              ? (theme === 'dark' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-rose-100 text-rose-700 border border-rose-300')
                              : (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-300')
                          }`}>
                            {p.isDoshaPresent ? `House ${p.marsHouse} (Active)` : `House ${p.marsHouse} (Safe)`}
                          </span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                          {p.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Classical Cancellations (Kuja Bhanga) */}
                <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
                  theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200 shadow-xs'
                }`}>
                  <h5 className={`font-serif font-bold text-sm uppercase tracking-wider ${
                    theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-900'
                  }`}>
                    Classical Kuja Dosha Bhanga (Cancellation Rules Evaluated)
                  </h5>
                  <div className="space-y-2">
                    {calcResult.cancellations.map((c: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                          c.isApplied
                            ? (theme === 'dark' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-900')
                            : (theme === 'dark' ? 'bg-[#1c2541]/50 border-white/5 text-gray-400' : 'bg-white border-slate-200 text-slate-600')
                        }`}
                      >
                        <div>
                          <strong className={`text-xs block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {c.rule}
                          </strong>
                          <span className={`text-[11px] ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                            {c.description}
                          </span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          c.isApplied
                            ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border border-emerald-300')
                            : (theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-slate-200 text-slate-600')
                        }`}>
                          {c.isApplied ? '✓ Bhanga Applied' : 'Not Applicable'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Marriage Guidance & Vedic Remedies */}
                <div className={`p-5 rounded-2xl border space-y-3.5 transition-colors ${
                  theme === 'dark' ? 'bg-[#0b132b] border-rose-500/30' : 'bg-rose-50/80 border-rose-200 shadow-xs'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🪔</span>
                    <h5 className={`font-serif font-bold text-sm uppercase tracking-wider ${
                      theme === 'dark' ? 'text-rose-400' : 'text-rose-900'
                    }`}>
                      Marriage Guidance & Vedic Shanti Remedies
                    </h5>
                  </div>
                  <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    theme === 'dark' ? 'bg-[#1c2541] border-white/5 text-gray-200' : 'bg-white border-rose-200 text-slate-800 shadow-2xs'
                  }`}>
                    <strong className={`block mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Marital Advice:
                    </strong>
                    {calcResult.marriageGuidance}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      theme === 'dark' ? 'bg-[#1c2541] border-white/5' : 'bg-white border-rose-200 shadow-2xs'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-rose-300' : 'text-rose-800'}`}>
                        Ritual / Shanti
                      </span>
                      <p className={`text-[11px] ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        {calcResult.vedicRemedies.ritual}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      theme === 'dark' ? 'bg-[#1c2541] border-white/5' : 'bg-white border-rose-200 shadow-2xs'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-rose-300' : 'text-rose-800'}`}>
                        Vedic Mantra
                      </span>
                      <p className={`font-mono text-[11px] select-all font-bold ${theme === 'dark' ? 'text-amber-200' : 'text-amber-900'}`}>
                        {calcResult.vedicRemedies.mantra}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      theme === 'dark' ? 'bg-[#1c2541] border-white/5' : 'bg-white border-rose-200 shadow-2xs'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-rose-300' : 'text-rose-800'}`}>
                        Gemstone Recommendation
                      </span>
                      <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                        {calcResult.vedicRemedies.gemstone}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      theme === 'dark' ? 'bg-[#1c2541] border-white/5' : 'bg-white border-rose-200 shadow-2xs'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-rose-300' : 'text-rose-800'}`}>
                        Charity & Donation
                      </span>
                      <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                        {calcResult.vedicRemedies.donation}
                      </p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl border text-[11px] ${
                    theme === 'dark' ? 'bg-[#1c2541] border-white/5 text-amber-200' : 'bg-white border-amber-200 text-amber-950 shadow-2xs'
                  }`}>
                    <strong>Lifestyle:</strong> {calcResult.vedicRemedies.lifestyle}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Print Manglik Dosh Report</span>
                  </button>
                  <button
                    onClick={() => setCalcResult(null)}
                    className={`py-3 px-5 rounded-xl font-bold text-xs border cursor-pointer transition-colors ${
                      theme === 'dark'
                        ? 'bg-[#0b132b] hover:bg-[#334155] text-gray-300 border-[#3a506b]'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                    }`}
                  >
                    Calculate Another Native
                  </button>
                </div>
              </div>
            )}

            {/* Results Output for Kaal Sarp Dosh */}
            {calcResult && calcResult.isKaalSarp && (
              <div className="space-y-6 font-sans text-xs">
                {/* Header Card */}
                <div className={`p-6 rounded-3xl border text-left space-y-4 relative overflow-hidden transition-colors ${
                  !calcResult.hasKaalSarp
                    ? (theme === 'dark' ? 'bg-gradient-to-br from-emerald-950/70 via-[#0b132b] to-[#0b132b] border-emerald-500/40' : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 border-emerald-300 text-slate-900 shadow-sm')
                    : (theme === 'dark' ? 'bg-gradient-to-br from-purple-950/70 via-[#0b132b] to-[#0b132b] border-purple-500/40' : 'bg-gradient-to-br from-purple-50 via-white to-purple-100/50 border-purple-300 text-slate-900 shadow-sm')
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl shadow-lg shrink-0 ${
                        theme === 'dark' ? 'bg-[#0b132b] border-white/10' : 'bg-white border-slate-200'
                      }`}>
                        🐍
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            theme === 'dark' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-900 border-purple-300'
                          }`}>
                            KAAL SARP YOGA ANALYSIS
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            calcResult.intensity === 'Purna (Full)'
                              ? (theme === 'dark' ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' : 'bg-rose-100 text-rose-800 border border-rose-300')
                              : calcResult.intensity === 'Anshik (Partial)'
                              ? (theme === 'dark' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'bg-amber-100 text-amber-800 border border-amber-300')
                              : (theme === 'dark' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-100 text-emerald-800 border border-emerald-300')
                          }`}>
                            Intensity: {calcResult.intensity}
                          </span>
                        </div>
                        <h4 className={`font-serif font-bold text-2xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {calcResult.nativeName}
                        </h4>
                        <p className={`text-xs font-semibold mt-0.5 ${theme === 'dark' ? 'text-purple-200' : 'text-slate-700'}`}>
                          Direction: <span className="text-amber-700 dark:text-amber-300 font-bold">{calcResult.direction}</span> • Rahu House {calcResult.rahuHouse} ({calcResult.rahuSign}) / Ketu House {calcResult.ketuHouse} ({calcResult.ketuSign})
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-2xl border text-right shrink-0 ${
                      theme === 'dark' ? 'bg-[#1c2541]/90 border-white/10' : 'bg-white/95 border-purple-200 shadow-xs'
                    }`}>
                      <span className={`block text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        Identified Type
                      </span>
                      <strong className={`text-base font-bold block mt-0.5 ${
                        calcResult.hasKaalSarp
                          ? (theme === 'dark' ? 'text-purple-300' : 'text-purple-700')
                          : (theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600')
                      }`}>
                        {calcResult.doshType}
                      </strong>
                      <span className={`text-[11px] block ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                        {calcResult.doshTypeManipuri}
                      </span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    theme === 'dark' ? 'bg-[#0b132b]/80 border-white/10 text-gray-200' : 'bg-white/90 border-purple-200 text-slate-800 shadow-2xs'
                  }`}>
                    <p>{calcResult.classicalDescription}</p>
                  </div>
                </div>

                {/* Axis Details & Planetary Containment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className={`p-4 rounded-2xl border space-y-2 transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className={`font-serif font-bold text-xs uppercase tracking-wider block ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-900'
                    }`}>
                      Planets Trapped in Rahu-Ketu Axis
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {calcResult.planetsEnclosed.map((p: string, idx: number) => (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 rounded-xl font-bold text-xs border ${
                            theme === 'dark'
                              ? 'bg-purple-500/20 text-purple-200 border-purple-500/30'
                              : 'bg-purple-100 text-purple-900 border-purple-300'
                          }`}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border space-y-2 transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className={`font-serif font-bold text-xs uppercase tracking-wider block ${
                      theme === 'dark' ? 'text-emerald-400' : 'text-emerald-900'
                    }`}>
                      Planets Outside / Free from Axis
                    </span>
                    {calcResult.planetsFree.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {calcResult.planetsFree.map((p: string, idx: number) => (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 rounded-xl font-bold text-xs border ${
                              theme === 'dark'
                                ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30'
                                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            }`}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className={`text-xs italic ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        All core 7 planets are trapped inside the nodal hemisphere.
                      </span>
                    )}
                  </div>
                </div>

                {/* Life Domain Impacts */}
                {calcResult.effects && calcResult.effects.length > 0 && (
                  <div className="space-y-2">
                    <h5 className={`font-serif font-bold text-sm uppercase tracking-wider ${
                      theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-900'
                    }`}>
                      Specific Life Domain Influences
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {calcResult.effects.map((ef: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border space-y-1.5 transition-colors ${
                            theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                          }`}
                        >
                          <span className={`font-bold text-xs block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {ef.lifeDomain}
                          </span>
                          <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                            {ef.impact}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vedic Shanti Remedies */}
                <div className={`p-5 rounded-2xl border space-y-3.5 transition-colors ${
                  theme === 'dark' ? 'bg-[#0b132b] border-purple-500/30' : 'bg-purple-50/80 border-purple-200 shadow-xs'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🪔</span>
                    <h5 className={`font-serif font-bold text-sm uppercase tracking-wider ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-900'
                    }`}>
                      Prescribed Kaal Sarp Shanti Remedies
                    </h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      theme === 'dark' ? 'bg-[#1c2541] border-white/5' : 'bg-white border-purple-200 shadow-2xs'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>
                        Shanti Puja
                      </span>
                      <p className={`text-[11px] ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        {calcResult.vedicRemedies.shantiPuja}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      theme === 'dark' ? 'bg-[#1c2541] border-white/5' : 'bg-white border-purple-200 shadow-2xs'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>
                        Vedic Mantras
                      </span>
                      <p className={`font-mono text-[11px] select-all font-bold ${theme === 'dark' ? 'text-amber-200' : 'text-amber-900'}`}>
                        {calcResult.vedicRemedies.mantra}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      theme === 'dark' ? 'bg-[#1c2541] border-white/5' : 'bg-white border-purple-200 shadow-2xs'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>
                        Sacred Rudraksha
                      </span>
                      <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                        {calcResult.vedicRemedies.rudraksha}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      theme === 'dark' ? 'bg-[#1c2541] border-white/5' : 'bg-white border-purple-200 shadow-2xs'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>
                        Charity & Dana
                      </span>
                      <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                        {calcResult.vedicRemedies.charity}
                      </p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl border text-[11px] ${
                    theme === 'dark' ? 'bg-[#1c2541] border-white/5 text-amber-200' : 'bg-white border-amber-200 text-amber-950 shadow-2xs'
                  }`}>
                    <strong>Special Dates:</strong> {calcResult.vedicRemedies.specialDates}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Print Kaal Sarp Report</span>
                  </button>
                  <button
                    onClick={() => setCalcResult(null)}
                    className={`py-3 px-5 rounded-xl font-bold text-xs border cursor-pointer transition-colors ${
                      theme === 'dark'
                        ? 'bg-[#0b132b] hover:bg-[#334155] text-gray-300 border-[#3a506b]'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                    }`}
                  >
                    Calculate Another Native
                  </button>
                </div>
              </div>
            )}

            {/* Results Output for Match Making (Ashtakoot 36-Gun Milan) */}
            {calcResult && calcResult.isMatchMaking && (
              <div className="space-y-6 font-sans text-xs">
                {/* Header Score Card */}
                <div className={`p-6 rounded-3xl border text-left space-y-4 relative overflow-hidden transition-colors ${
                  calcResult.totalScore >= 24
                    ? (theme === 'dark' ? 'bg-gradient-to-br from-emerald-950/70 via-[#0b132b] to-[#0b132b] border-emerald-500/40' : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 border-emerald-300 text-slate-900 shadow-sm')
                    : calcResult.totalScore >= 18
                    ? (theme === 'dark' ? 'bg-gradient-to-br from-amber-950/70 via-[#0b132b] to-[#0b132b] border-amber-500/40' : 'bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-amber-300 text-slate-900 shadow-sm')
                    : (theme === 'dark' ? 'bg-gradient-to-br from-rose-950/70 via-[#0b132b] to-[#0b132b] border-rose-500/40' : 'bg-gradient-to-br from-rose-50 via-white to-rose-100/50 border-rose-300 text-slate-900 shadow-sm')
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl shadow-lg shrink-0 ${
                        theme === 'dark' ? 'bg-[#0b132b] border-white/10' : 'bg-white border-slate-200'
                      }`}>
                        💍
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            theme === 'dark' ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' : 'bg-pink-100 text-pink-900 border-pink-300'
                          }`}>
                            ASHTAKOOT 36-GUN MILAN REPORT
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            calcResult.totalScore >= 24
                              ? (theme === 'dark' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-100 text-emerald-800 border border-emerald-300')
                              : calcResult.totalScore >= 18
                              ? (theme === 'dark' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'bg-amber-100 text-amber-800 border border-amber-300')
                              : (theme === 'dark' ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' : 'bg-rose-100 text-rose-800 border border-rose-300')
                          }`}>
                            {calcResult.verdict}
                          </span>
                        </div>
                        <h4 className={`font-serif font-bold text-2xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {calcResult.groomName} & {calcResult.brideName}
                        </h4>
                        <p className={`text-xs font-semibold mt-0.5 ${theme === 'dark' ? 'text-pink-200' : 'text-slate-700'}`}>
                          Groom: {calcResult.groomMoonSign} ({calcResult.groomNakshatra}) • Bride: {calcResult.brideMoonSign} ({calcResult.brideNakshatra})
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-2xl border text-center shrink-0 ${
                      theme === 'dark' ? 'bg-[#1c2541]/90 border-white/10' : 'bg-white/95 border-pink-200 shadow-xs'
                    }`}>
                      <span className={`block text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        Total Gun Score
                      </span>
                      <div className={`text-4xl font-black font-mono mt-0.5 ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-800'}`}>
                        {calcResult.totalScore} <span className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>/ 36</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                        {calcResult.percentage}% Match
                      </span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    theme === 'dark' ? 'bg-[#0b132b]/80 border-white/10 text-gray-200' : 'bg-white/90 border-pink-200 text-slate-800 shadow-2xs'
                  }`}>
                    <p>{calcResult.verdictDescription}</p>
                  </div>
                </div>

                {/* Manglik Compatibility & Critical Dosh Alerts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className={`p-4 rounded-2xl border space-y-2 transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className={`font-serif font-bold text-xs uppercase tracking-wider block ${
                      theme === 'dark' ? 'text-amber-400' : 'text-amber-900'
                    }`}>
                      Manglik Compatibility (Kuja Samya)
                    </span>
                    <div className={`space-y-1.5 text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                      <div className="flex justify-between">
                        <span>Groom:</span>
                        <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{calcResult.groomManglik.status}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Bride:</span>
                        <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{calcResult.brideManglik.status}</strong>
                      </div>
                      <div className={`p-2.5 rounded-xl border text-[11px] mt-1 ${
                        theme === 'dark' ? 'bg-[#1c2541] border-white/5 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-950'
                      }`}>
                        {calcResult.manglikCompatibilityVerdict}
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border space-y-2 transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className={`font-serif font-bold text-xs uppercase tracking-wider block ${
                      theme === 'dark' ? 'text-rose-400' : 'text-rose-900'
                    }`}>
                      Critical Dosh Evaluations
                    </span>
                    <div className="space-y-2 text-xs">
                      <div className={`p-2 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2541] border-white/5' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="flex justify-between items-center mb-0.5">
                          <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Nadi Dosh:</strong>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            calcResult.nadiDoshAlert
                              ? (theme === 'dark' ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-100 text-rose-800')
                              : (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800')
                          }`}>
                            {calcResult.nadiDoshAlert ? 'Alert' : 'Clear / Cancelled'}
                          </span>
                        </div>
                        <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                          {calcResult.nadiDoshDetails}
                        </p>
                      </div>

                      <div className={`p-2 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2541] border-white/5' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="flex justify-between items-center mb-0.5">
                          <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Bhakoot Dosh:</strong>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            calcResult.bhakootDoshAlert
                              ? (theme === 'dark' ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-100 text-rose-800')
                              : (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800')
                          }`}>
                            {calcResult.bhakootDoshAlert ? 'Alert' : 'Clear / Friendly'}
                          </span>
                        </div>
                        <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                          {calcResult.bhakootDoshDetails}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ashtakoot 8-Fold Gun Breakdown Table */}
                <div className="space-y-2">
                  <h5 className={`font-serif font-bold text-sm uppercase tracking-wider ${
                    theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-900'
                  }`}>
                    Ashtakoot 8-Fold Point Breakdown (36 Gunas)
                  </h5>
                  <div className={`overflow-x-auto rounded-2xl border ${
                    theme === 'dark' ? 'border-[#3a506b]/60' : 'border-slate-200 shadow-xs'
                  }`}>
                    <table className="w-full text-left border-collapse">
                      <thead className={`text-[10px] uppercase tracking-wider font-bold ${
                        theme === 'dark' ? 'bg-[#0b132b] text-gray-400' : 'bg-slate-100 text-slate-800'
                      }`}>
                        <tr>
                          <th className="p-3">Koot (Test)</th>
                          <th className="p-3">Obtained / Max</th>
                          <th className="p-3">Significance & Compatibility Impact</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className={`text-xs ${
                        theme === 'dark' ? 'divide-y divide-[#3a506b]/40' : 'divide-y divide-slate-200'
                      }`}>
                        {calcResult.kootBreakdown.map((k: any, idx: number) => (
                          <tr
                            key={idx}
                            className={theme === 'dark' ? 'hover:bg-[#1c2541]/50' : 'hover:bg-slate-50 bg-white'}
                          >
                            <td className={`p-3 font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {k.kootName}
                            </td>
                            <td className={`p-3 font-mono font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-800'}`}>
                              {k.obtainedPoints} / {k.maxPoints}
                            </td>
                            <td className={`p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                              <span className={`block font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {k.significance}
                              </span>
                              <span className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                {k.description}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                k.status === 'Pass'
                                  ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border border-emerald-300')
                                  : k.status === 'Partial'
                                  ? (theme === 'dark' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-100 text-amber-800 border border-amber-300')
                                  : (theme === 'dark' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-rose-100 text-rose-800 border border-rose-300')
                              }`}>
                                {k.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Vedic Marriage Remedies */}
                {calcResult.remedies && calcResult.remedies.length > 0 && (
                  <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] border-pink-500/30' : 'bg-pink-50/80 border-pink-200 shadow-xs'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🪔</span>
                      <h5 className={`font-serif font-bold text-sm uppercase tracking-wider ${
                        theme === 'dark' ? 'text-pink-400' : 'text-pink-900'
                      }`}>
                        Vedic Remedies & Compatibility Enhancements
                      </h5>
                    </div>
                    <ul className={`space-y-1.5 text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                      {calcResult.remedies.map((rem: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-pink-600 dark:text-pink-400 font-bold">•</span>
                          <span>{rem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Print Match Making Report</span>
                  </button>
                  <button
                    onClick={() => setCalcResult(null)}
                    className={`py-3 px-5 rounded-xl font-bold text-xs border cursor-pointer transition-colors ${
                      theme === 'dark'
                        ? 'bg-[#0b132b] hover:bg-[#334155] text-gray-300 border-[#3a506b]'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                    }`}
                  >
                    Calculate Another Couple
                  </button>
                </div>
              </div>
            )}

            {/* Results Output for Planetary Yogas */}
            {calcResult && calcResult.isPlanetaryYogas && (
              <div className="space-y-6 font-sans text-xs">
                {/* Header Card */}
                <div className={`p-6 rounded-3xl border text-left space-y-4 relative overflow-hidden transition-colors ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-amber-950/70 via-[#0b132b] to-[#0b132b] border-amber-500/40'
                    : 'bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-amber-300 text-slate-900 shadow-sm'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl shadow-lg shrink-0 ${
                        theme === 'dark' ? 'bg-[#0b132b] border-white/10' : 'bg-white border-slate-200'
                      }`}>
                        ✨
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            theme === 'dark' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}>
                            VEDIC PLANETARY YOGAS REPORT
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                            theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}>
                            {calcResult.auspiciousCount} Auspicious Combinations
                          </span>
                        </div>
                        <h4 className={`font-serif font-bold text-2xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {calcResult.nativeName}
                        </h4>
                        <p className={`text-xs font-semibold mt-0.5 ${theme === 'dark' ? 'text-amber-200' : 'text-slate-700'}`}>
                          Lagna: <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{calcResult.ascendantSign}</span> • Moon Sign: <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{calcResult.moonSign}</span>
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-2xl border text-center shrink-0 ${
                      theme === 'dark' ? 'bg-[#1c2541]/90 border-white/10' : 'bg-white/95 border-amber-200 shadow-xs'
                    }`}>
                      <span className={`block text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        Total Yogas
                      </span>
                      <div className={`text-4xl font-black font-mono mt-0.5 ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-800'}`}>
                        {calcResult.totalYogasDetected}
                      </div>
                      <span className={`text-[10px] block ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                        Classical Combinations
                      </span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    theme === 'dark' ? 'bg-[#0b132b]/80 border-white/10 text-gray-200' : 'bg-white/90 border-amber-200 text-slate-800 shadow-2xs'
                  }`}>
                    <p>{calcResult.overallSummary}</p>
                  </div>
                </div>

                {/* Yogas Cards Grid */}
                <div className="space-y-2">
                  <h5 className={`font-serif font-bold text-sm uppercase tracking-wider ${
                    theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-900'
                  }`}>
                    Detected Classical Vedic Yogas ({calcResult.yogas.length})
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {calcResult.yogas.map((yoga: any) => (
                      <div
                        key={yoga.id}
                        className={`p-5 rounded-3xl border space-y-3 transition-all ${
                          yoga.nature === 'Challenging'
                            ? (theme === 'dark' ? 'bg-[#0b132b] border-rose-500/30' : 'bg-white border-rose-200 shadow-xs')
                            : (theme === 'dark' ? 'bg-[#0b132b] border-amber-500/30' : 'bg-white border-amber-200 shadow-xs')
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className={`text-[10px] font-extrabold uppercase block tracking-wider ${
                              theme === 'dark' ? 'text-amber-400' : 'text-amber-800'
                            }`}>
                              {yoga.category}
                            </span>
                            <h4 className={`font-serif font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {yoga.name}
                            </h4>
                            <span className={`text-[11px] block font-blipi ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                              {yoga.nameBengali}
                            </span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                            yoga.nature === 'Highly Auspicious'
                              ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border border-emerald-300')
                              : yoga.nature === 'Auspicious'
                              ? (theme === 'dark' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-700 border border-emerald-200')
                              : yoga.nature === 'Mixed'
                              ? (theme === 'dark' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-amber-100 text-amber-800 border border-amber-300')
                              : (theme === 'dark' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-rose-100 text-rose-800 border border-rose-300')
                          }`}>
                            {yoga.nature} • {yoga.strength}
                          </span>
                        </div>

                        <div className={`p-3 rounded-2xl border space-y-1 text-xs ${
                          theme === 'dark' ? 'bg-[#1c2541] border-white/5' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                            Classical Rule
                          </span>
                          <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                            {yoga.classicalRule}
                          </p>
                          <div className={`pt-1 flex items-center gap-2 text-[10px] font-mono ${
                            theme === 'dark' ? 'text-amber-300' : 'text-amber-800 font-bold'
                          }`}>
                            <span>Planets: {yoga.planetsInvolved.join(', ')}</span>
                            <span>•</span>
                            <span>Houses: {yoga.houseInvolved}</span>
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <span className={`text-[10px] uppercase font-bold block ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-800'}`}>
                            Astrological Prediction
                          </span>
                          <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                            {yoga.prediction}
                          </p>
                        </div>

                        {yoga.remedy && (
                          <div className={`p-2.5 rounded-xl border text-[11px] ${
                            theme === 'dark' ? 'bg-rose-950/40 border-rose-500/30 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-800'
                          }`}>
                            <strong>Remedial Note:</strong> {yoga.remedy}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Print Planetary Yogas Report</span>
                  </button>
                  <button
                    onClick={() => setCalcResult(null)}
                    className={`py-3 px-5 rounded-xl font-bold text-xs border cursor-pointer transition-colors ${
                      theme === 'dark'
                        ? 'bg-[#0b132b] hover:bg-[#334155] text-gray-300 border-[#3a506b]'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                    }`}
                  >
                    Calculate Another Native
                  </button>
                </div>
              </div>
            )}

            {/* Results Output for ঙা-ঈশিং (Nga-Eeshing) */}
            {calcResult && calcResult.isNgaEeshingReport && (
              <div className="space-y-6 font-sans text-xs">
                {/* Header Verdict Card */}
                <div
                  className={`p-6 rounded-3xl border text-left space-y-4 relative overflow-hidden transition-colors ${
                    calcResult.isNgaEeshing
                      ? theme === 'dark'
                        ? 'bg-gradient-to-br from-rose-950/70 via-[#0b132b] to-[#0b132b] border-rose-500/40'
                        : 'bg-gradient-to-br from-rose-50 via-white to-amber-50 border-rose-300 text-slate-900 shadow-sm'
                      : theme === 'dark'
                      ? 'bg-gradient-to-br from-emerald-950/70 via-[#0b132b] to-[#0b132b] border-emerald-500/40'
                      : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 border-emerald-300 text-slate-900 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl shadow-lg shrink-0 ${
                          theme === 'dark' ? 'bg-[#0b132b] border-white/10' : 'bg-white border-slate-200'
                        }`}
                      >
                        {calcResult.isNgaEeshing ? '🐟' : '✨'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                              theme === 'dark'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-amber-100 text-amber-900 border-amber-300'
                            }`}
                          >
                            KANGLEI ASTROLOGY • ঙা-ঈশিং
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase border ${
                              calcResult.isNgaEeshing
                                ? theme === 'dark'
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                  : 'bg-rose-100 text-rose-800 border-rose-300'
                                : theme === 'dark'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            {calcResult.verdictText}
                          </span>
                        </div>
                        <h4
                          className={`font-serif font-bold text-2xl ${
                            calcResult.isNgaEeshing
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          {calcResult.verdictText}
                        </h4>
                        <p className={`text-xs font-semibold mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                          {calcResult.groomName} ({calcResult.groomRashi.nameBengali}) & {calcResult.brideName} ({calcResult.brideRashi.nameBengali})
                        </p>
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-2xl border text-center shrink-0 ${
                        theme === 'dark' ? 'bg-[#1c2541]/90 border-white/10' : 'bg-white/95 border-amber-200 shadow-xs'
                      }`}
                    >
                      <span className={`block text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        মওং / প্রকৃতি
                      </span>
                      <div className={`text-sm font-black mt-1 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-800'}`}>
                        {calcResult.natureStatement}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Overview (No internal math formulas shown) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Groom Details */}
                  <div
                    className={`p-5 rounded-2xl border space-y-3 ${
                      theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">
                        নুপা (Groom)
                      </span>
                    </div>
                    <div className="text-base font-bold">
                      {calcResult.groomName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      রাশি: <strong className="text-slate-800 dark:text-white">{calcResult.groomRashi.nameBengali} ({calcResult.groomRashi.nameEnglish})</strong>
                    </div>
                    {calcResult.isNgaEeshing && (
                      <div
                        className={`p-2.5 rounded-xl text-sm font-black text-center border ${
                          calcResult.groomNature === 'ঙা'
                            ? (theme === 'dark' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200')
                            : (theme === 'dark' ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : 'bg-teal-50 text-teal-700 border-teal-200')
                        }`}
                      >
                        {calcResult.groomNature}
                      </div>
                    )}
                  </div>

                  {/* Bride Details */}
                  <div
                    className={`p-5 rounded-2xl border space-y-3 ${
                      theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-rose-500 dark:text-rose-400">
                        নুপী (Bride)
                      </span>
                    </div>
                    <div className="text-base font-bold">
                      {calcResult.brideName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      রাশি: <strong className="text-slate-800 dark:text-white">{calcResult.brideRashi.nameBengali} ({calcResult.brideRashi.nameEnglish})</strong>
                    </div>
                    {calcResult.isNgaEeshing && (
                      <div
                        className={`p-2.5 rounded-xl text-sm font-black text-center border ${
                          calcResult.brideNature === 'ঙা'
                            ? (theme === 'dark' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200')
                            : (theme === 'dark' ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : 'bg-teal-50 text-teal-700 border-teal-200')
                        }`}
                      >
                        {calcResult.brideNature}
                      </div>
                    )}
                  </div>
                </div>

                {/* Remedial Guidance & Ceremony if YES */}
                {calcResult.isNgaEeshing && (
                  <div className="space-y-4">
                    {/* Guidance Notice */}
                    <div
                      className={`p-5 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                        theme === 'dark'
                          ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                          : 'bg-amber-50/90 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div className="font-extrabold text-sm flex items-center gap-2">
                        <span>📜</span>
                        <span>প্রতিকারগী পাউতাক (Guidance Notice)</span>
                      </div>
                      <p className="whitespace-pre-line font-medium text-xs">
                        {calcResult.remedyGuidance}
                      </p>
                    </div>

                    {/* Koklaba Thouram (Remedial Rite) */}
                    <div
                      className={`p-6 rounded-2xl border space-y-4 text-xs ${
                        theme === 'dark'
                          ? 'bg-[#1c2541]/70 border-white/10 text-gray-200'
                          : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                      }`}
                    >
                      <div className="border-b pb-3 border-gray-500/20">
                        <h5 className="font-serif font-bold text-base text-amber-600 dark:text-[#fbbf24]">
                          {calcResult.remedyTitle}
                        </h5>
                      </div>

                      {/* Potchang Mawong */}
                      <div className="space-y-2">
                        <span className="font-black text-[11px] uppercase tracking-wide text-rose-500 dark:text-rose-400 block">
                          পোৎচং মওং -
                        </span>
                        <p className="leading-relaxed text-xs">
                          {calcResult.potchangText}
                        </p>
                      </div>

                      {/* Lairon */}
                      <div
                        className={`p-4 rounded-xl border space-y-2 ${
                          theme === 'dark'
                            ? 'bg-[#0b132b] border-white/5 text-gray-300'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-black text-[11px] uppercase tracking-wide text-amber-600 dark:text-amber-400 block">
                          লাইরোন -
                        </span>
                        <p className="leading-relaxed text-xs italic">
                          "{calcResult.laironText}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Print ঙা-ঈশিং Report</span>
                  </button>
                  <button
                    onClick={() => setCalcResult(null)}
                    className={`py-3 px-5 rounded-xl font-bold text-xs border cursor-pointer transition-colors ${
                      theme === 'dark'
                        ? 'bg-[#0b132b] hover:bg-[#334155] text-gray-300 border-[#3a506b]'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                    }`}
                  >
                    Calculate Another Couple
                  </button>
                </div>
              </div>
            )}

            {/* Default Generic Results Output */}
            {calcResult &&
              !calcResult.isKuthiChart &&
              !calcResult.isYumsharol &&
              !calcResult.isSadeSati &&
              !calcResult.isManglikReport &&
              !calcResult.isKaalSarp &&
              !calcResult.isMatchMaking &&
              !calcResult.isPlanetaryYogas &&
              !calcResult.isNgaEeshingReport && (
              <div className="space-y-5 font-sans text-xs">
                <div className={`p-5 rounded-2xl border text-center space-y-1 transition-colors ${
                  theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    theme === 'dark' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    REPORT: {calcResult.type}
                  </span>
                  <h4 className={`text-xl font-serif font-bold pt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {calcResult.type}
                  </h4>
                </div>
                <button
                  onClick={() => setCalcResult(null)}
                  className={`w-full py-3 rounded-xl font-bold text-xs border cursor-pointer transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#0b132b] hover:bg-[#334155] text-gray-300 border-[#3a506b]'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                  }`}
                >
                  Calculate Another Profile
                </button>
              </div>
            )}
          </div>
        )}
        </div>
      )}

      {/* ASTROLOGER CHANGE PASSWORD MODAL */}
      {/* ASTROLOGER CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full p-6 space-y-4 border shadow-2xl text-left font-sans transition-colors ${
            theme === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex justify-between items-center pb-3 border-b ${
              theme === 'dark' ? 'border-[#3a506b]' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#d97706] text-white flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-serif font-bold text-lg ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-900'}`}>
                    Update Portal Password
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                    Change your Astrologer Login Passcode
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className={`p-1 cursor-pointer transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pwdError && (
              <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/50 text-red-500 dark:text-red-300 text-xs font-bold">
                ⚠️ {pwdError}
              </div>
            )}

            {pwdMsg && (
              <div className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-500/50 text-emerald-600 dark:text-emerald-300 text-xs font-bold">
                {pwdMsg}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${
                  theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-700'
                }`}>
                  Current Password / Passcode *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full h-10 px-3.5 rounded-xl border font-mono text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                    theme === 'dark' ? 'border-[#3a506b] bg-[#0b132b] text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${
                  theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-700'
                }`}>
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 4 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full h-10 px-3.5 rounded-xl border font-mono text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                    theme === 'dark' ? 'border-[#3a506b] bg-[#0b132b] text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${
                  theme === 'dark' ? 'text-[#e0a96d]' : 'text-slate-700'
                }`}>
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full h-10 px-3.5 rounded-xl border font-mono text-xs focus:border-[#d97706] focus:outline-none transition-colors ${
                    theme === 'dark' ? 'border-[#3a506b] bg-[#0b132b] text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                  }`}
                />
              </div>

              <div className={`flex justify-end gap-2 pt-2 border-t ${
                theme === 'dark' ? 'border-[#3a506b]' : 'border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                    theme === 'dark' ? 'bg-[#0b132b] text-gray-300 hover:bg-[#142042]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md cursor-pointer hover:opacity-95"
                >
                  {pwdLoading ? 'Saving...' : 'Update Password →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================== INSPECT RETURN & REPLACEMENT MODAL ========================== */}
      {selectedReturnDetail && (
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
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-serif font-bold text-lg ${theme === 'dark' ? 'text-[#fbbf24]' : 'text-amber-800'}`}>
                    Return & Replacement Claim Details
                  </h3>
                  <p className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                    Ticket: {selectedReturnDetail.id} • Order: {selectedReturnDetail.orderRef}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReturnDetail(null)}
                className={`p-2 transition-colors cursor-pointer ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Status Alert Banner */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                selectedReturnDetail.status === 'APPROVED_REPLACEMENT'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300'
                  : selectedReturnDetail.status === 'APPROVED_REFUND'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                  : selectedReturnDetail.status === 'REJECTED'
                  ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
              }`}>
                <div className="shrink-0 mt-0.5">
                  {selectedReturnDetail.status === 'APPROVED_REPLACEMENT' && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                  {selectedReturnDetail.status === 'APPROVED_REFUND' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {selectedReturnDetail.status === 'PENDING' && <Clock className="w-5 h-5 text-amber-500" />}
                  {selectedReturnDetail.status === 'REJECTED' && <XCircle className="w-5 h-5 text-red-500" />}
                  {selectedReturnDetail.status === 'RESOLVED' && <CheckCircle2 className="w-5 h-5 text-slate-500" />}
                </div>
                <div>
                  <div className="font-extrabold text-sm">
                    {selectedReturnDetail.status === 'APPROVED_REPLACEMENT' && 'Replacement Approved by Admin'}
                    {selectedReturnDetail.status === 'APPROVED_REFUND' && 'Refund Approved by Admin'}
                    {selectedReturnDetail.status === 'PENDING' && 'Claim Under Admin Verification'}
                    {selectedReturnDetail.status === 'REJECTED' && 'Claim Rejected by Admin'}
                    {selectedReturnDetail.status === 'RESOLVED' && 'Issue Resolved & Ticket Closed'}
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    {selectedReturnDetail.status === 'APPROVED_REPLACEMENT' &&
                      'Admin has confirmed that the item qualifies for replacement. Astrologer is requested to prepare and energize a fresh unit for dispatch.'}
                    {selectedReturnDetail.status === 'APPROVED_REFUND' &&
                      'Admin finance has processed the monetary refund directly to the customer. Payout deduction has been logged in seller accounts.'}
                    {selectedReturnDetail.status === 'PENDING' &&
                      'Customer has submitted proof of damage/defect. Admin team is evaluating the return window and courier liability. No astrologer action required yet.'}
                    {selectedReturnDetail.status === 'REJECTED' &&
                      'Admin has rejected the return claim. No replacement or refund is due from the astrologer.'}
                    {selectedReturnDetail.status === 'RESOLVED' &&
                      'All replacement or refund actions have been completed.'}
                  </p>
                </div>
              </div>

              {/* Product & Customer Details Grid */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Product Claimed</span>
                    <span className={`font-bold text-sm block mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {selectedReturnDetail.productTitle}
                    </span>
                    <span className="text-[10px] font-mono text-[#d97706] block mt-0.5">Order Ref: {selectedReturnDetail.orderRef}</span>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Customer Details</span>
                    <span className={`font-bold text-sm block mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {selectedReturnDetail.customerName}
                    </span>
                    <span className={`text-[11px] block ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                      {selectedReturnDetail.customerPhone}
                    </span>
                    {selectedReturnDetail.customerEmail && (
                      <span className={`text-[10px] block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        {selectedReturnDetail.customerEmail}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-dashed border-gray-500/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Request Type</span>
                    <span className="font-extrabold text-xs text-[#d97706] dark:text-[#fbbf24] block mt-0.5">
                      {selectedReturnDetail.requestType === 'REPLACEMENT' ? '🔁 Product Replacement' : '💸 Monetary Refund'}
                    </span>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Customer Reason</span>
                    <span className="font-bold text-xs block mt-0.5 text-rose-500">
                      {selectedReturnDetail.reason === 'DAMAGED_TRANSIT' && 'Damaged in Transit'}
                      {selectedReturnDetail.reason === 'DEFECTIVE_QUALITY' && 'Defective Quality / Faulty Bead'}
                      {selectedReturnDetail.reason === 'WRONG_ITEM' && 'Wrong Item Received'}
                      {selectedReturnDetail.reason === 'OTHER' && 'Other Reason'}
                    </span>
                  </div>
                </div>

                {/* Refund Method & Account Details if Refund */}
                {selectedReturnDetail.requestType === 'REFUND' && selectedReturnDetail.refundDetails && (
                  <div className="pt-2 border-t border-dashed border-gray-500/30">
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Refund Destination Details</span>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs mt-1">
                      {selectedReturnDetail.refundMethod || 'UPI'}: {selectedReturnDetail.refundDetails}
                    </div>
                  </div>
                )}
              </div>

              {/* Customer's Explanation */}
              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Customer's Stated Issue</span>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                  "{selectedReturnDetail.reasonDetails || 'No additional note provided by client.'}"
                </p>
              </div>

              {/* Photo Evidence Gallery if Attached */}
              {selectedReturnDetail.photos && selectedReturnDetail.photos.length > 0 && (
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                    Photo Proof Attached by Customer ({selectedReturnDetail.photos.length})
                  </span>
                  <div className="flex flex-wrap gap-3 pt-1">
                    {selectedReturnDetail.photos.map((url: string, pIdx: number) => (
                      <a
                        key={pIdx}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative w-24 h-24 rounded-xl overflow-hidden border border-[#3a506b] shadow-xs cursor-pointer block"
                      >
                        <img src={url} alt="Damage Proof" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                          View Full
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Notes & Instructions */}
              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                selectedReturnDetail.adminNotes
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : theme === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d97706] block">
                  Official Admin Resolution Notes
                </span>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>
                  {selectedReturnDetail.adminNotes || 'No notes added by Admin yet. Status will update once the verification is finished.'}
                </p>
              </div>

              {/* Practical Astrologer Action Guide */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 text-xs">
                <span className="font-extrabold text-[#d97706] dark:text-[#fbbf24] block uppercase tracking-wider text-[10px] mb-1">
                  💡 Guru Seller Action Guidance
                </span>
                {selectedReturnDetail.status === 'APPROVED_REPLACEMENT' ? (
                  <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                    👉 <strong>Action Required</strong>: Please inspect your consecrated stock for a pristine replacement of <span className="underline">{selectedReturnDetail.productTitle}</span>. Once energized at the altar, package it safely. Admin logistics will send courier pickup.
                  </p>
                ) : selectedReturnDetail.status === 'APPROVED_REFUND' ? (
                  <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                    👉 <strong>No Dispatch Required</strong>: The buyer has been refunded by Admin. Please do not ship a replacement. Inventory reconciliation has been made.
                  </p>
                ) : selectedReturnDetail.status === 'REJECTED' ? (
                  <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                    👉 <strong>Case Closed</strong>: Admin verified this claim was invalid or outside the policy window. No further action needed.
                  </p>
                ) : (
                  <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                    👉 <strong>Stand By</strong>: Admin is reviewing the courier logs. Please wait until status changes to "Replacement Approved" or "Refund Approved".
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex justify-end ${
              theme === 'dark' ? 'bg-[#0f172a] border-[#3a506b]' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setSelectedReturnDetail(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
