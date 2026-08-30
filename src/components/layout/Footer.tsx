'use client';

import React from 'react';
import { Moon, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard/astrologer')) {
    return null;
  }
  return (
    <footer className="bg-[#0f172a] text-gray-300 border-t border-[#1e293b] font-sans">
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1e293b] flex items-center justify-center text-[#fbbf24]">
                <Moon size={20} className="fill-[#fbbf24]" />
              </div>
              <div>
                <span className="font-serif text-2xl font-black text-white block leading-none">KuthiYengpham</span>
                <span className="text-xs text-[#fbbf24] font-extrabold uppercase tracking-wider block mt-1">by KangleiAstro</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Guiding your path with authentic Manipuri Kuthi Yengba, precise Vedic astrology calculations, and practical Jyotish remedies.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-[#fbbf24] transition-colors"><Facebook size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-[#fbbf24] transition-colors"><Twitter size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-[#fbbf24] transition-colors"><Instagram size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-[#fbbf24] transition-colors"><Youtube size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold text-[#fbbf24] mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li><Link href="/" className="hover:text-[#fbbf24] transition-colors">Home</Link></li>
              <li><Link href="/manipuri_free_kuthi" className="hover:text-[#fbbf24] transition-colors">Free Kundli Generator</Link></li>
              <li><Link href="/matching" className="hover:text-[#fbbf24] transition-colors">Kundli Matching (Gun Milan)</Link></li>
              <li><Link href="/services" className="hover:text-[#fbbf24] transition-colors">Services & Reports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold text-[#fbbf24] mb-4">Sacred Services</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li><Link href="/manipuri_kuthi" className="hover:text-[#fbbf24] transition-colors">Manipuri Kuthi Yengba & Kuthi Iba</Link></li>
              <li><Link href="/booking" className="hover:text-[#fbbf24] transition-colors">1-on-1 Video Consultation</Link></li>
              <li><Link href="/services" className="hover:text-[#fbbf24] transition-colors">Career & Financial Outlook</Link></li>
              <li><Link href="/services" className="hover:text-[#fbbf24] transition-colors">Marriage & Relationship Report</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold text-[#fbbf24] mb-4">Contact & Support</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="font-medium text-white">support@kuthiyengpham.in</li>
              <li className="font-medium text-white">+91 98765 43210</li>
              <li className="text-gray-400">Live Support: 9:30 AM – 6:00 PM IST</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#1e293b] flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>&copy; {new Date().getFullYear()} KuthiYengpham by KangleiAstro. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
