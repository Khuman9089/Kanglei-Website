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

  // Hide bottom nav in admin or astrologer portal or native app view
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard/astrologer') || pathname?.startsWith('/app')) {
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
      href: '/dashboard/astrologer?tab=panchang&mode=mobile',
      icon: Calendar,
    },
    {
      label: user ? 'Account' : 'Login',
      href: user ? (user.role === 'ASTROLOGER' ? '/dashboard/astrologer' : '/dashboard/client') : '/auth',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-sm px-2 py-1.5 pb-safe font-sans select-none-mobile">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const basePath = item.href.split('?')[0];
          const isActive = pathname === basePath || (basePath !== '/' && pathname?.startsWith(basePath));
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative app-active-press ${
                isActive
                  ? 'text-amber-600 font-bold'
                  : 'text-gray-400 hover:text-gray-700 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-amber-600' : 'text-gray-400'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-3 px-1 py-0.2 rounded-full bg-emerald-600 text-white text-[8px] font-black leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-amber-600' : 'font-medium text-gray-500'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-0.5 shadow-2xs" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
