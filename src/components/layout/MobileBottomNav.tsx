'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Sparkles, Calendar, User } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

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

  // Hide bottom nav in admin or astrologer portal
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard/astrologer')) {
    return null;
  }

  const NAV_ITEMS = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
    },
    {
      label: 'Astrologers',
      href: '/astrologers',
      icon: Users,
      badge: 'LIVE',
    },
    {
      label: 'Services',
      href: '/services',
      icon: Sparkles,
    },
    {
      label: 'Panchang',
      href: '/panchang',
      icon: Calendar,
    },
    {
      label: user ? 'Account' : 'Login',
      href: user ? (user.role === 'ASTROLOGER' ? '/dashboard/astrologer' : '/dashboard/client') : '/auth',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-[#f3e8d2] shadow-[0_-5px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 font-sans">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-[#b45309] font-extrabold'
                  : 'text-gray-500 hover:text-[#b45309] font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#d97706]' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-3 px-1 py-0.2 rounded-full bg-emerald-500 text-white text-[8px] font-black leading-none animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-[#b45309]' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#d97706] mt-0.5 shadow-xs" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
