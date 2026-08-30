'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Phone, Mail, Headphones, Menu, X, Calendar, User, LogOut, ChevronDown, LayoutDashboard, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
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
              <span className="font-serif text-2xl font-bold tracking-tight text-[#0f172a] block leading-none">
                KangleiAstro
              </span>
              <span className="text-[10px] text-[#b45309] font-sans font-bold tracking-wider block uppercase mt-0.5">
                Vedic Astrology • Based on Moon Sign
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            <Link
              href="/horoscope"
              className="px-3.5 py-2 rounded-xl text-sm font-extrabold text-gray-800 hover:text-[#b45309] hover:bg-[#fef3c7]/60 transition-colors whitespace-nowrap"
            >
              Horoscopes
            </Link>
            <Link
              href="/astrologers"
              className="px-3.5 py-2 rounded-xl text-sm font-extrabold text-gray-800 hover:text-[#b45309] hover:bg-[#fef3c7]/60 transition-colors whitespace-nowrap"
            >
              Astrologers
            </Link>
            <Link
              href="/services"
              className="px-3.5 py-2 rounded-xl text-sm font-extrabold text-gray-800 hover:text-[#b45309] hover:bg-[#fef3c7]/60 transition-colors whitespace-nowrap"
            >
              Services
            </Link>
            <Link
              href="/shop"
              className="px-3.5 py-2 rounded-xl text-sm font-extrabold text-gray-800 hover:text-[#b45309] hover:bg-[#fef3c7]/60 transition-colors whitespace-nowrap"
            >
              E-Store
            </Link>
            <Link
              href="/blog"
              className="px-3.5 py-2 rounded-xl text-sm font-extrabold text-gray-800 hover:text-[#b45309] hover:bg-[#fef3c7]/60 transition-colors whitespace-nowrap"
            >
              Blog
            </Link>
            <Link
              href="/#testimonials"
              className="px-3.5 py-2 rounded-xl text-sm font-extrabold text-gray-800 hover:text-[#b45309] hover:bg-[#fef3c7]/60 transition-colors whitespace-nowrap"
            >
              Client Reviews
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/manipuri_kuthi"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs hover:opacity-95 transition-opacity shadow-sm whitespace-nowrap shrink-0"
            >
              <Moon className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
              <span>Kuthi Yengba</span>
            </Link>

            <Link
              href="/manipuri_kuthi"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#78350f] hover:bg-[#92400e] text-white border border-[#fde68a] font-extrabold text-xs transition-all shadow-sm whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span>Kuthi Iba</span>
            </Link>

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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b border-[#f3e8d2] px-6 py-5 space-y-4 md:hidden shadow-xl"
          >
            <Link href="/" onClick={() => setIsOpen(false)} className="block py-1 text-base font-bold text-[#0f172a]">
              Home
            </Link>
            <Link href="/manipuri_free_kuthi" onClick={() => setIsOpen(false)} className="block py-1 text-base font-bold text-[#b45309]">
              Free Kundli Generator
            </Link>
            <Link href="/matching" onClick={() => setIsOpen(false)} className="block py-1 text-base font-bold text-[#0f172a]">
              Kundli Matching (Gun Milan)
            </Link>
            <Link href="/services" onClick={() => setIsOpen(false)} className="block py-1 text-base font-bold text-[#0f172a]">
              Consultation & Reports
            </Link>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link href="/manipuri_kuthi" onClick={() => setIsOpen(false)} className="block py-3 text-center rounded-xl bg-[#d97706] text-white font-bold text-xs">
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
