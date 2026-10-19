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

  // Hide bottom nav in admin or astrologer portal or native app view or standalone astroai
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard/astrologer') || pathname?.startsWith('/app') || pathname?.startsWith('/astroai')) {
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-3 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom,0.6rem))] bg-[#0b0f19]/90 backdrop-blur-xl border-t border-slate-800/80 shadow-[0_-8px_30px_rgba(0,0,0,0.4)] select-none-mobile">
      <div className="flex items-center justify-around max-w-md mx-auto">
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
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-amber-400' : 'text-slate-400'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-3.5 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[8px] font-black leading-none shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-black text-amber-400' : 'font-medium text-slate-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 shadow-sm shadow-amber-400/50" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
