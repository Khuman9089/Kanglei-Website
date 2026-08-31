'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, Phone, Mail, Headphones, Menu, X, Calendar, User, LogOut, ChevronDown, 
  LayoutDashboard, Sparkles, Sun, ExternalLink 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavSubItem {
  id: string;
  title: string;
  href: string;
  description?: string;
  badge?: string;
  active: boolean;
}

export interface NavItem {
  id: string;
  title: string;
  href: string;
  badge?: string;
  type: 'link' | 'dropdown';
  subItems?: NavSubItem[];
  active: boolean;
  order: number;
}

export interface NavbarConfig {
  items: NavItem[];
  cbs: {
    showKuthiYengbaBtn: boolean;
    kuthiYengbaBtnText: string;
    kuthiYengbaBtnHref: string;
    showKuthiIbaBtn: boolean;
    kuthiIbaBtnText: string;
    kuthiIbaBtnHref: string;
    showNumitLeppaBtn: boolean;
    numitLeppaBtnText: string;
    numitLeppaBtnHref: string;
  };
}

const DEFAULT_NAVBAR_CONFIG: NavbarConfig = {
  items: [
    {
      id: 'nav-1',
      title: 'Horoscopes',
      href: '/horoscope',
      type: 'link',
      active: true,
      order: 1,
    },
    {
      id: 'nav-2',
      title: 'Astrologers',
      href: '/astrologers',
      type: 'link',
      active: true,
      order: 2,
    },
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
    {
      id: 'nav-4',
      title: 'E-Store',
      href: '/shop',
      type: 'link',
      active: true,
      order: 4,
    },
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
    {
      id: 'nav-6',
      title: 'Blog',
      href: '/blog',
      type: 'link',
      active: true,
      order: 6,
    },
    {
      id: 'nav-7',
      title: 'Numit Leppa',
      href: '/numit_leppa_yengba',
      type: 'link',
      active: true,
      order: 7,
    },
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
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);

  // Dynamic Navigation Configuration
  const [navConfig, setNavConfig] = useState<NavbarConfig>(DEFAULT_NAVBAR_CONFIG);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch live navbar configuration
    fetch('/api/navbar')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          setNavConfig(data);
        }
      })
      .catch(() => {});

    const loadUser = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('kanglei_user');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch (e) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    loadUser();

    window.addEventListener('user-login-change', loadUser);
    window.addEventListener('storage', loadUser);
    return () => {
      window.removeEventListener('user-login-change', loadUser);
      window.removeEventListener('storage', loadUser);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kanglei_user');
      localStorage.removeItem('kanglei_client_authed');
      localStorage.removeItem('kanglei_logged_out');
      window.dispatchEvent(new Event('user-login-change'));
    }
    setUser(null);
    setShowUserDropdown(false);
    window.location.href = '/';
  };

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard/astrologer')) {
    return null;
  }

  const activeNavItems = navConfig.items
    .filter((item) => item.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* 1. TOP UTILITY BAR (Bright Warm Gold Theme - Hidden on Mobile, Desktop Only) */}
      <div className="hidden md:block bg-[#fef3c7] text-[#78350f] text-xs border-b border-[#fde68a]">
        <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 font-medium">
              <Headphones className="w-3.5 h-3.5 text-[#b45309]" />
              <span>Live Support (9:30 AM – 6:00 PM IST)</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-[#b45309]" />
              <a href="mailto:ccare@kangleiastro.com" className="hover:underline">
                ccare@kangleiastro.com
              </a>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <Phone className="w-3.5 h-3.5 text-[#b45309]" />
              <a href="tel:+919876543210" className="hover:underline">
                +91 98765 43210
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="px-3.5 py-1 rounded bg-gradient-to-r from-[#b45309] to-[#d97706] text-white font-bold text-[11px] uppercase tracking-wider hover:opacity-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>MY ACCOUNT ({user.name ? user.name.split(' ')[0] : 'PROFILE'})</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-1.5 w-56 bg-white rounded-2xl border border-[#f3e8d2] shadow-xl py-2 z-50 text-xs text-gray-800"
                    >
                      <div className="px-4 py-2.5 border-b border-[#f3e8d2]">
                        <div className="font-bold text-gray-900 truncate">{user.name}</div>
                        <div className="text-[10px] text-[#b45309] font-mono mt-0.5">{user.role || 'CLIENT'} PROFILE</div>
                      </div>

                      <Link
                        href={user.role === 'ASTROLOGER' ? '/dashboard/astrologer' : '/dashboard/client'}
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-amber-50 text-gray-700 font-semibold transition-colors"
                      >
                        <User className="w-4 h-4 text-[#d97706]" />
                        <span>My Profile & Contact Details</span>
                      </Link>

                      <Link
                        href={user.role === 'ASTROLOGER' ? '/dashboard/astrologer' : '/dashboard/client'}
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-amber-50 text-gray-700 font-semibold transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#d97706]" />
                        <span>My Dashboard</span>
                      </Link>

                      <div className="border-t border-[#f3e8d2] mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-red-600 font-bold transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/auth?tab=login"
                  className="px-3.5 py-1 rounded bg-[#d97706] text-white font-bold text-[11px] uppercase tracking-wider hover:bg-[#b45309] transition-colors shadow-xs"
                >
                  LOGIN
                </Link>
                <Link
                  href="/auth?tab=signup"
                  className="px-3 py-1 rounded border border-[#78350f]/30 text-[#78350f] font-bold text-[11px] uppercase tracking-wider hover:bg-[#78350f]/10 transition-colors"
                >
                  SIGN UP
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <nav
        className={`transition-all duration-300 bg-white text-[#0f172a] border-b border-[#f3e8d2] px-4 sm:px-6 lg:px-8 ${
          scrolled ? 'py-3 shadow-md' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#0f172a] flex items-center justify-center text-[#fbbf24] group-hover:scale-105 transition-transform shadow-md">
              <Moon className="w-5 h-5 fill-[#fbbf24]" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-black tracking-tight text-[#0f172a] block leading-none">
                KuthiYengpham
              </span>
              <span className="font-script text-[11px] sm:text-xs text-[#b45309] font-bold italic tracking-tight block leading-tight mt-0.5 whitespace-nowrap">
                by KangleiAstro • Vishuddha Siddhanta
              </span>
            </div>
          </Link>

          {/* Dynamic Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {activeNavItems.map((item) => {
              const isDropdown = item.type === 'dropdown' && item.subItems && item.subItems.length > 0;
              const isDropdownOpen = activeDropdownId === item.id;

              if (isDropdown) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setActiveDropdownId(item.id)}
                    onMouseLeave={() => setActiveDropdownId(null)}
                  >
                    <button
                      className="px-3 py-2 rounded-xl text-sm font-extrabold text-gray-800 hover:text-[#b45309] hover:bg-[#fef3c7]/60 transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer"
                    >
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-amber-500 text-white">
                          {item.badge}
                        </span>
                      )}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180 text-[#d97706]' : 'text-gray-400'}`} />
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 mt-1 w-72 bg-white rounded-2xl border border-[#f3e8d2] shadow-2xl p-2 z-50 text-xs"
                        >
                          <div className="space-y-1">
                            {item.subItems
                              ?.filter((sub) => sub.active !== false)
                              .map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={sub.href}
                                  className="block p-2.5 rounded-xl hover:bg-[#fef3c7]/60 transition-colors group"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-[#0f172a] group-hover:text-[#b45309]">
                                      {sub.title}
                                    </span>
                                    {sub.badge && (
                                      <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-[#d97706] text-white">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </div>
                                  {sub.description && (
                                    <p className="text-[11px] text-gray-500 font-medium mt-0.5 leading-tight">
                                      {sub.description}
                                    </p>
                                  )}
                                </Link>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="px-3 py-2 rounded-xl text-sm font-extrabold text-gray-800 hover:text-[#b45309] hover:bg-[#fef3c7]/60 transition-colors whitespace-nowrap flex items-center gap-1"
                >
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-amber-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Dynamic Action Buttons */}
          <div className="flex items-center gap-2">
            {navConfig.cbs?.showNumitLeppaBtn && (
              <Link
                href={navConfig.cbs.numitLeppaBtnHref || '/numit_leppa_yengba'}
                className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition-opacity shadow-sm whitespace-nowrap shrink-0"
              >
                <Sun className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
                <span>{navConfig.cbs.numitLeppaBtnText || 'Numit Leppa'}</span>
              </Link>
            )}

            {navConfig.cbs?.showKuthiYengbaBtn && (
              <Link
                href={navConfig.cbs.kuthiYengbaBtnHref || '/manipuri_kuthi_yengba'}
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs hover:opacity-95 transition-opacity shadow-sm whitespace-nowrap shrink-0"
              >
                <Moon className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
                <span>{navConfig.cbs.kuthiYengbaBtnText || 'Kuthi Yengba'}</span>
              </Link>
            )}

            {navConfig.cbs?.showKuthiIbaBtn && (
              <Link
                href={navConfig.cbs.kuthiIbaBtnHref || '/manipuri_kuthi'}
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#78350f] hover:bg-[#92400e] text-white border border-[#fde68a] font-extrabold text-xs transition-all shadow-sm whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span>{navConfig.cbs.kuthiIbaBtnText || 'Kuthi Iba'}</span>
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#0f172a] hover:text-[#d97706] transition-colors md:hidden"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Dynamic Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b border-[#f3e8d2] px-6 py-5 space-y-3 md:hidden shadow-xl max-h-[85vh] overflow-y-auto"
          >
            <Link href="/" onClick={() => setIsOpen(false)} className="block py-1 text-base font-bold text-[#0f172a]">
              Home
            </Link>

            {activeNavItems.map((item) => {
              const isDropdown = item.type === 'dropdown' && item.subItems && item.subItems.length > 0;
              const isExpanded = mobileExpandedId === item.id;

              if (isDropdown) {
                return (
                  <div key={item.id} className="border-b border-gray-100 pb-2 pt-1">
                    <button
                      onClick={() => setMobileExpandedId(isExpanded ? null : item.id)}
                      className="w-full flex items-center justify-between py-1 text-base font-bold text-[#0f172a] text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-amber-500 text-white">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180 text-[#d97706]' : 'text-gray-400'}`} />
                    </button>

                    {isExpanded && (
                      <div className="pl-3 mt-2 space-y-2 border-l-2 border-[#fde68a]">
                        {item.subItems
                          ?.filter((sub) => sub.active !== false)
                          .map((sub) => (
                            <Link
                              key={sub.id}
                              href={sub.href}
                              onClick={() => setIsOpen(false)}
                              className="block py-1 text-sm font-semibold text-gray-700 hover:text-[#b45309]"
                            >
                              <div className="flex items-center gap-2">
                                <span>{sub.title}</span>
                                {sub.badge && (
                                  <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-[#d97706] text-white">
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                              {sub.description && (
                                <p className="text-[10px] text-gray-500 font-normal">{sub.description}</p>
                              )}
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-1 text-base font-bold text-[#0f172a] border-b border-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-amber-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link href="/manipuri_kuthi_yengba" onClick={() => setIsOpen(false)} className="block py-3 text-center rounded-xl bg-[#d97706] text-white font-bold text-xs">
                Kuthi Yengba
              </Link>
              <Link href="/manipuri_kuthi" onClick={() => setIsOpen(false)} className="block py-3 text-center rounded-xl bg-[#0f172a] text-[#fbbf24] border border-[#fde68a] font-bold text-xs">
                Kuthi Iba
              </Link>
            </div>

            {/* Mobile Support Contact Section under main menu */}
            <div className="pt-4 border-t border-[#f3e8d2] space-y-3 font-sans">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#b45309]">
                Live Support & Contact
              </div>
              <div className="space-y-2 text-xs font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-[#d97706]" />
                  <span>Live Support (9:30 AM – 6:00 PM IST)</span>
                </div>
                <a href="tel:+919876543210" className="flex items-center gap-2 text-[#0f172a] font-bold hover:underline">
                  <Phone className="w-4 h-4 text-[#d97706]" />
                  <span>+91 98765 43210</span>
                </a>
                <a href="mailto:ccare@kangleiastro.com" className="flex items-center gap-2 text-gray-600 hover:underline">
                  <Mail className="w-4 h-4 text-[#d97706]" />
                  <span>ccare@kangleiastro.com</span>
                </a>
              </div>

              {/* Mobile Account Auth Buttons */}
              <div className="pt-2 flex items-center gap-2">
                {user ? (
                  <Link
                    href={user.role === 'ASTROLOGER' ? '/dashboard/astrologer' : '/dashboard/client'}
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#b45309] to-[#d97706] text-white font-extrabold text-xs text-center shadow-xs flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>My Account ({user.name ? user.name.split(' ')[0] : 'Profile'})</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth?tab=login"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-2.5 rounded-xl bg-[#d97706] text-white font-extrabold text-xs text-center shadow-xs hover:bg-[#b45309] transition-colors"
                    >
                      LOGIN
                    </Link>
                    <Link
                      href="/auth?tab=signup"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-[#78350f]/40 text-[#78350f] font-extrabold text-xs text-center hover:bg-[#78350f]/10 transition-colors"
                    >
                      SIGN UP
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
