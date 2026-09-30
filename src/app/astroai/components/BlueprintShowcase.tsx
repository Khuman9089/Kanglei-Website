'use client';

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Share2,
  Check,
  Shield,
  Heart,
  Briefcase,
  Coins,
  Activity,
  Calendar,
  Clock,
  MapPin,
  Home,
  Flame,
  Star,
  Layers,
  Crown,
  Lock,
  Users,
  Grid,
  FileText,
  HelpCircle,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Info,
  ExternalLink,
  ChevronDown,
  Download,
  FileDown,
  MessageCircle,
  Eye,
  Sliders,
  Settings,
  Bell,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { BirthProfile } from '../types';

interface BlueprintShowcaseProps {
  onSelectScreen: (screenId: string) => void;
  activeScreen: string;
}

export function BlueprintShowcase({ onSelectScreen, activeScreen }: BlueprintShowcaseProps) {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 py-4 px-2 sm:px-4">
      
      {/* Top Showcase Hero matching Blueprint Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#667EEA] to-[#764BA2] text-white flex items-center justify-center shadow-lg ring-4 ring-indigo-50 shrink-0">
            <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black tracking-tight text-[#1F2937] font-serif">
                AstroVista
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
                Production UI Blueprint
              </span>
            </div>
            <p className="text-xs font-bold text-[#667EEA]">
              Your Life • Your Stars • Your Future
            </p>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              Personalized astrology insights, powered by your birth details. Discover your strengths, opportunities and the best path ahead.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-900 text-xs font-bold shrink-0 shadow-2xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Simple Input → Powerful Insights → A Better You</span>
        </div>
      </div>

      {/* Row 1: Screens 1 through 5 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            Onboarding &amp; Daily Engagement Flow (Screens 1 – 5)
          </span>
          <span className="text-[11px] text-indigo-600 font-semibold">
            Click any device mockup to interact
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* SCREEN 1: Splash Screen */}
          <div
            onClick={() => onSelectScreen('splash')}
            className={`group cursor-pointer rounded-3xl p-3 border transition-all ${
              activeScreen === 'splash'
                ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-300 shadow-lg scale-[1.02]'
                : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="w-5 h-5 rounded-full bg-[#1F2937] text-white text-[10px] font-black flex items-center justify-center">
                1
              </span>
              <div>
                <h4 className="text-xs font-black text-slate-800">Splash Screen</h4>
                <p className="text-[9px] text-slate-400">Brand intro &amp; value</p>
              </div>
            </div>

            {/* Visual Mockup Container */}
            <div className="w-full aspect-[9/18] rounded-2xl bg-gradient-to-b from-[#090D2A] via-[#141C48] to-[#2D1B4E] text-white p-3 flex flex-col justify-between overflow-hidden shadow-inner relative text-center">
              <div className="flex justify-between items-center text-[8px] text-slate-400 pt-0.5 px-1">
                <span>9:30</span>
                <span>5G 🔋</span>
              </div>
              
              <div className="space-y-2 my-auto">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#667EEA] to-[#764BA2] p-[1.5px] mx-auto flex items-center justify-center shadow-lg">
                  <div className="w-full h-full rounded-full bg-[#0E152E] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-300" />
                  </div>
                </div>
                <h5 className="text-sm font-black font-serif">AstroVista</h5>
                <p className="text-[7px] text-indigo-200 uppercase font-semibold">Your Stars • Your Future</p>
                <p className="text-[8px] text-slate-300/80 line-clamp-2 px-1">
                  Discover insights, make better decisions &amp; unlock potential.
                </p>
              </div>

              <div className="space-y-1 pb-1">
                <div className="w-full py-1.5 rounded-xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-[9px] font-bold shadow-xs">
                  Get Started →
                </div>
                <p className="text-[7px] text-slate-400">Loading your cosmic journey...</p>
              </div>
            </div>
          </div>

          {/* SCREEN 2: Login / Sign Up */}
          <div
            onClick={() => onSelectScreen('login')}
            className={`group cursor-pointer rounded-3xl p-3 border transition-all ${
              activeScreen === 'login'
                ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-300 shadow-lg scale-[1.02]'
                : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="w-5 h-5 rounded-full bg-[#1F2937] text-white text-[10px] font-black flex items-center justify-center">
                2
              </span>
              <div>
                <h4 className="text-xs font-black text-slate-800">Login / Skip</h4>
                <p className="text-[9px] text-slate-400">Continue or skip</p>
              </div>
            </div>

            <div className="w-full aspect-[9/18] rounded-2xl bg-[#F8FAFF] p-3 flex flex-col justify-between overflow-hidden shadow-inner border border-slate-200/60">
              <div className="flex justify-between items-center text-[8px] text-slate-600 px-1">
                <span>9:30</span>
                <span>5G 🔋</span>
              </div>

              <div className="space-y-2 my-auto text-center">
                <h5 className="text-xs font-black text-slate-900 font-serif">Welcome Back</h5>
                <p className="text-[8px] text-slate-500">Log in to continue your journey</p>

                <div className="space-y-1.5 pt-1 text-[8px] font-bold">
                  <div className="w-full py-1.5 px-2 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center gap-1 shadow-2xs">
                    <span>🌐 Google</span>
                  </div>
                  <div className="w-full py-1.5 px-2 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center gap-1 shadow-2xs">
                    <span> Apple</span>
                  </div>
                  <div className="text-[7px] text-slate-400 uppercase py-0.5">or</div>
                  <div className="w-full py-1.5 px-2 rounded-xl bg-white border border-slate-200 text-slate-400 text-left">
                    Mobile / Email
                  </div>
                  <div className="w-full py-1.5 rounded-xl bg-[#667EEA] text-white shadow-xs">
                    Continue
                  </div>
                </div>
              </div>

              <div className="text-center text-[8px] font-bold text-slate-400 pb-1">
                Skip for now
              </div>
            </div>
          </div>

          {/* SCREEN 3: Birth Details Entry */}
          <div
            onClick={() => onSelectScreen('birth_entry')}
            className={`group cursor-pointer rounded-3xl p-3 border transition-all ${
              activeScreen === 'birth_entry'
                ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-300 shadow-lg scale-[1.02]'
                : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="w-5 h-5 rounded-full bg-[#1F2937] text-white text-[10px] font-black flex items-center justify-center">
                3
              </span>
              <div>
                <h4 className="text-xs font-black text-slate-800">Birth Details</h4>
                <p className="text-[9px] text-slate-400">Date, time &amp; place</p>
              </div>
            </div>

            <div className="w-full aspect-[9/18] rounded-2xl bg-[#F8FAFF] p-3 flex flex-col justify-between overflow-hidden shadow-inner border border-slate-200/60">
              <div className="flex justify-between items-center text-[8px] text-slate-600 px-1">
                <span>9:30</span>
                <span>5G 🔋</span>
              </div>

              <div className="space-y-2 text-left">
                <div className="space-y-0.5">
                  <h5 className="text-[11px] font-black text-slate-900 font-serif">← Birth Details</h5>
                  <p className="text-[7.5px] text-slate-500">Create personalized profile</p>
                </div>

                <div className="space-y-1.5 text-[8px]">
                  <div className="bg-white p-1.5 rounded-xl border border-slate-200">
                    <span className="text-[7px] text-slate-400 block">Date of Birth</span>
                    <strong className="text-slate-800">15/08/1995 📅</strong>
                  </div>
                  <div className="bg-white p-1.5 rounded-xl border border-slate-200">
                    <span className="text-[7px] text-slate-400 block">Time of Birth (Optional)</span>
                    <strong className="text-slate-800">10:30 AM ⏰</strong>
                  </div>
                  <div className="bg-white p-1.5 rounded-xl border border-slate-200">
                    <span className="text-[7px] text-slate-400 block">Place of Birth (Optional)</span>
                    <strong className="text-slate-800">Delhi, India 📍</strong>
                  </div>

                  <div className="p-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-[7px] text-indigo-900 leading-tight">
                    ℹ Date of birth is enough for quick reading.
                  </div>
                </div>
              </div>

              <div className="w-full py-1.5 rounded-xl bg-[#667EEA] text-white text-[9px] font-bold text-center shadow-xs">
                Continue →
              </div>
            </div>
          </div>

          {/* SCREEN 4: Confirm Details */}
          <div
            onClick={() => onSelectScreen('confirm_details')}
            className={`group cursor-pointer rounded-3xl p-3 border transition-all ${
              activeScreen === 'confirm_details'
                ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-300 shadow-lg scale-[1.02]'
                : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="w-5 h-5 rounded-full bg-[#1F2937] text-white text-[10px] font-black flex items-center justify-center">
                4
              </span>
              <div>
                <h4 className="text-xs font-black text-slate-800">Confirm Details</h4>
                <p className="text-[9px] text-slate-400">Review &amp; save</p>
              </div>
            </div>

            <div className="w-full aspect-[9/18] rounded-2xl bg-[#F8FAFF] p-3 flex flex-col justify-between overflow-hidden shadow-inner border border-slate-200/60">
              <div className="flex justify-between items-center text-[8px] text-slate-600 px-1">
                <span>9:30</span>
                <span>5G 🔋</span>
              </div>

              <div className="space-y-2 text-left">
                <div className="space-y-0.5">
                  <h5 className="text-[11px] font-black text-slate-900 font-serif">← Confirm Details</h5>
                  <p className="text-[7.5px] text-slate-500">Check information before proceeding</p>
                </div>

                <div className="bg-white p-2 rounded-2xl border border-slate-200 space-y-1.5 text-[8px]">
                  <div className="flex items-center gap-1.5">
                    <span>📅</span>
                    <div>
                      <span className="text-[6.5px] text-slate-400 block">Date of Birth</span>
                      <strong className="text-slate-800">15 Aug 1995</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>⏰</span>
                    <div>
                      <span className="text-[6.5px] text-slate-400 block">Time of Birth</span>
                      <strong className="text-slate-800">10:30 AM</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>📍</span>
                    <div>
                      <span className="text-[6.5px] text-slate-400 block">Place of Birth</span>
                      <strong className="text-slate-800">Delhi, India</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1 pb-1">
                <div className="w-full py-1.5 rounded-xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white text-[9px] font-bold text-center shadow-xs">
                  Save &amp; Continue
                </div>
                <p className="text-[7px] text-slate-400 text-center font-bold">Edit Details</p>
              </div>
            </div>
          </div>

          {/* SCREEN 5: Home Dashboard */}
          <div
            onClick={() => onSelectScreen('home')}
            className={`group cursor-pointer rounded-3xl p-3 border transition-all ${
              activeScreen === 'home'
                ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-300 shadow-lg scale-[1.02]'
                : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="w-5 h-5 rounded-full bg-[#1F2937] text-white text-[10px] font-black flex items-center justify-center">
                5
              </span>
              <div>
                <h4 className="text-xs font-black text-slate-800">Home Dashboard</h4>
                <p className="text-[9px] text-slate-400">Personalized overview</p>
              </div>
            </div>

            <div className="w-full aspect-[9/18] rounded-2xl bg-[#F8FAFF] p-2.5 flex flex-col justify-between overflow-hidden shadow-inner border border-slate-200/60">
              <div className="flex justify-between items-center text-[8px] text-slate-600 px-1">
                <span>9:30</span>
                <span>5G 🔋</span>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h6 className="text-[9px] font-black text-slate-900 font-serif leading-tight">
                      Good Morning, Rahul ✨
                    </h6>
                    <p className="text-[6.5px] text-slate-400">Cosmic snapshot</p>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[8px]">
                    ✨
                  </div>
                </div>

                {/* Sun Sign Card */}
                <div className="bg-amber-500/15 p-1.5 rounded-xl border border-amber-300/40 flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs">
                    ♌
                  </div>
                  <div>
                    <strong className="text-[8px] text-slate-900 block font-serif">Leo (Jul 23 - Aug 22)</strong>
                    <span className="text-[6.5px] text-amber-900">Confident Leader</span>
                  </div>
                </div>

                {/* 6 Icons row */}
                <div className="grid grid-cols-6 gap-0.5 text-center">
                  {['👤', '💼', '❤️', '💰', '💚', '•••'].map((ico, idx) => (
                    <div key={idx} className="bg-white p-1 rounded-md border border-slate-200 text-[8px]">
                      {ico}
                    </div>
                  ))}
                </div>

                {/* Today's Insight */}
                <div className="bg-white p-1.5 rounded-xl border border-slate-200 space-y-0.5">
                  <span className="text-[7px] font-bold text-slate-800 block">Today&apos;s Insight &gt;</span>
                  <p className="text-[6.5px] text-slate-500 leading-tight">
                    Stay focused, your efforts are bringing positive change.
                  </p>
                </div>
              </div>

              {/* Bottom Nav Bar */}
              <div className="h-6 bg-white border-t border-slate-200 rounded-lg flex items-center justify-around text-[7px] font-bold text-slate-400">
                <span className="text-[#667EEA]">Home</span>
                <span>Reports</span>
                <span>Explore</span>
                <span>Profile</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Row 2: Screens 6 through 9 + Key Data Flow */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            Profiles, Detailed Reports &amp; Virality Upgrade (Screens 6 – 9)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* SCREEN 6: Add / Edit Birth Details */}
          <div
            onClick={() => onSelectScreen('profile_menu')}
            className={`group cursor-pointer rounded-3xl p-3 border transition-all ${
              activeScreen === 'profile_menu'
                ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-300 shadow-lg scale-[1.02]'
                : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="w-5 h-5 rounded-full bg-[#1F2937] text-white text-[10px] font-black flex items-center justify-center">
                6
              </span>
              <div>
                <h4 className="text-xs font-black text-slate-800">Profile Settings</h4>
                <p className="text-[9px] text-slate-400">Add / edit birth info</p>
              </div>
            </div>

            <div className="w-full aspect-[9/18] rounded-2xl bg-[#F8FAFF] p-2.5 flex flex-col justify-between overflow-hidden shadow-inner border border-slate-200/60">
              <div className="flex justify-between items-center text-[8px] text-slate-600 px-1">
                <span>9:30</span>
                <span>5G 🔋</span>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[8px] font-bold">
                    R
                  </div>
                  <div>
                    <strong className="text-[8px] text-slate-900 block font-serif">Rahul</strong>
                    <span className="text-[6.5px] text-slate-400">rahul@gmail.com</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-[7px] font-bold text-slate-700">
                  <div className="p-1.5 flex justify-between items-center">
                    <span>My Birth Details</span>
                    <span>&gt;</span>
                  </div>
                  <div className="p-1.5 flex justify-between items-center">
                    <span>Other Users</span>
                    <span>&gt;</span>
                  </div>
                  <div className="p-1.5 flex justify-between items-center">
                    <span>App Settings</span>
                    <span>&gt;</span>
                  </div>
                  <div className="p-1.5 flex justify-between items-center">
                    <span>Help &amp; Support</span>
                    <span>&gt;</span>
                  </div>
                  <div className="p-1.5 text-red-500 font-bold">Log Out</div>
                </div>
              </div>

              <div className="h-6 bg-white border-t border-slate-200 rounded-lg flex items-center justify-around text-[7px] font-bold text-slate-400">
                <span>Home</span>
                <span>Reports</span>
                <span>Explore</span>
                <span className="text-[#667EEA]">Profile</span>
              </div>
            </div>
          </div>

          {/* SCREEN 7: Manage Multiple Profiles */}
          <div
            onClick={() => onSelectScreen('profiles')}
            className={`group cursor-pointer rounded-3xl p-3 border transition-all ${
              activeScreen === 'profiles'
                ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-300 shadow-lg scale-[1.02]'
                : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="w-5 h-5 rounded-full bg-[#1F2937] text-white text-[10px] font-black flex items-center justify-center">
                7
              </span>
              <div>
                <h4 className="text-xs font-black text-slate-800">Multiple Profiles</h4>
                <p className="text-[9px] text-slate-400">Family &amp; friends</p>
              </div>
            </div>

            <div className="w-full aspect-[9/18] rounded-2xl bg-[#F8FAFF] p-2.5 flex flex-col justify-between overflow-hidden shadow-inner border border-slate-200/60">
              <div className="flex justify-between items-center text-[8px] text-slate-600 px-1">
                <span>9:30</span>
                <span>5G 🔋</span>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="space-y-0.5">
                  <h6 className="text-[9px] font-black text-slate-900 font-serif">← Other Users</h6>
                  <p className="text-[6.5px] text-slate-400">Manage birth details for multiple people</p>
                </div>

                <div className="space-y-1 text-[7px]">
                  {[
                    { name: 'Rahul', dob: '15 Aug 1995', active: true },
                    { name: 'Priya', dob: '22 Jan 1998', active: true },
                    { name: 'Mom', dob: '02 May 1970', active: true },
                    { name: 'Dad', dob: '14 Nov 1968', active: true },
                  ].map((usr, i) => (
                    <div key={i} className="p-1 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[6px]">
                          {usr.name[0]}
                        </span>
                        <div>
                          <strong className="block text-slate-800">{usr.name}</strong>
                          <span className="text-slate-400 text-[6px]">{usr.dob}</span>
                        </div>
                      </div>
                      <span className="text-[6px] text-emerald-600 bg-emerald-50 px-1 rounded-sm font-bold">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full py-1.5 rounded-xl bg-[#667EEA] text-white text-[8px] font-bold text-center shadow-xs">
                + Add New Profile
              </div>
            </div>
          </div>

          {/* SCREEN 8: View Detailed Report */}
          <div
            onClick={() => onSelectScreen('reports_overview')}
            className={`group cursor-pointer rounded-3xl p-3 border transition-all ${
              activeScreen === 'reports_overview'
                ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-300 shadow-lg scale-[1.02]'
                : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="w-5 h-5 rounded-full bg-[#1F2937] text-white text-[10px] font-black flex items-center justify-center">
                8
              </span>
              <div>
                <h4 className="text-xs font-black text-slate-800">Detailed Report</h4>
                <p className="text-[9px] text-slate-400">Insights &amp; predictions</p>
              </div>
            </div>

            <div className="w-full aspect-[9/18] rounded-2xl bg-[#F8FAFF] p-2.5 flex flex-col justify-between overflow-hidden shadow-inner border border-slate-200/60">
              <div className="flex justify-between items-center text-[8px] text-slate-600 px-1">
                <span>9:30</span>
                <span>5G 🔋</span>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <h6 className="text-[9px] font-black text-slate-900 font-serif">← Your Astrology Report</h6>
                  <span className="text-[8px]">🔗</span>
                </div>

                <div className="flex gap-0.5 text-[6.5px] font-bold">
                  <span className="bg-[#667EEA] text-white px-1.5 py-0.5 rounded-md">Overview</span>
                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">Career</span>
                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">Love</span>
                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">More</span>
                </div>

                <div className="bg-white p-1.5 rounded-xl border border-slate-200 space-y-1 text-[7px]">
                  <strong className="text-slate-900 block text-[7.5px]">Key Highlights</strong>
                  <div className="flex justify-between">
                    <span>♌ Sun Sign</span>
                    <strong className="text-slate-800">Leo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>⚡ Life Path</span>
                    <strong className="text-indigo-600">6</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>🐾 Birth Number</span>
                    <strong className="text-purple-600">6</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>🎨 Lucky Colors</span>
                    <strong className="text-slate-800">Gold, Orange</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>📅 Lucky Days</span>
                    <strong className="text-slate-800">Sun, Fri</strong>
                  </div>
                </div>
              </div>

              <div className="w-full py-1.5 rounded-xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white text-[8px] font-bold text-center shadow-xs">
                View Full Report →
              </div>
            </div>
          </div>

          {/* SCREEN 9: Share / Save / Upgrade */}
          <div
            onClick={() => onSelectScreen('upgrade_screen')}
            className={`group cursor-pointer rounded-3xl p-3 border transition-all ${
              activeScreen === 'upgrade_screen'
                ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-300 shadow-lg scale-[1.02]'
                : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="w-5 h-5 rounded-full bg-[#1F2937] text-white text-[10px] font-black flex items-center justify-center">
                9
              </span>
              <div>
                <h4 className="text-xs font-black text-slate-800">Share / Upgrade</h4>
                <p className="text-[9px] text-slate-400">Virality &amp; premium</p>
              </div>
            </div>

            <div className="w-full aspect-[9/18] rounded-2xl bg-gradient-to-b from-[#090D2A] via-[#141C48] to-[#2D1B4E] text-white p-2.5 flex flex-col justify-between overflow-hidden shadow-inner relative text-center">
              <div className="flex justify-between items-center text-[8px] text-slate-400 px-1">
                <span>9:30</span>
                <span>5G 🔋</span>
              </div>

              <div className="space-y-1.5 my-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#667EEA] to-[#764BA2] mx-auto p-[1px] flex items-center justify-center shadow-lg">
                  <div className="w-full h-full rounded-full bg-[#0E152E] flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-300" />
                  </div>
                </div>
                <h6 className="text-[10px] font-black font-serif">Unlock Deeper Insights</h6>
                <p className="text-[6.5px] text-indigo-200/90 leading-tight px-1">
                  Get a detailed Kundli, Dasha analysis, compatibility and more.
                </p>

                <div className="w-full py-1.5 rounded-xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white text-[7.5px] font-bold shadow-xs">
                  Upgrade to Premium
                </div>

                <div className="flex justify-around text-[6.5px] text-slate-300 pt-1">
                  <span>🔗 Share</span>
                  <span>📄 PDF</span>
                  <span>⬇ Download</span>
                </div>
              </div>

              <p className="text-[6.5px] text-slate-400 pb-0.5">Maybe Later</p>
            </div>
          </div>

          {/* Key Data Flow Card (Rightmost column from blueprint) */}
          <div className="rounded-3xl p-4 bg-indigo-50/70 border border-indigo-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-950 block mb-2">
                Key Data Flow
              </span>
              <div className="space-y-1.5 text-[11px] text-slate-700">
                {[
                  { n: 1, text: 'Splash Screen (Brand value)' },
                  { n: 2, text: 'Login / Sign Up (Or Skip)' },
                  { n: 3, text: 'Birth Details Entry' },
                  { n: 4, text: 'Confirm Details' },
                  { n: 5, text: 'Home Dashboard (Overview)' },
                  { n: 6, text: 'Add/Edit Birth Details' },
                  { n: 7, text: 'Manage Multiple Profiles' },
                  { n: 8, text: 'View Detailed Report' },
                  { n: 9, text: 'Share / Save / Upgrade' },
                ].map((st) => (
                  <div key={st.n} className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[8px] font-black flex items-center justify-center shrink-0">
                      {st.n}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-800 leading-tight">
                      {st.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-indigo-200 text-[10px] text-indigo-900 font-bold">
              ✓ 100% Calibrated with AstroVista Engine
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Showcase Section: Features Included + Style Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-200">
        
        {/* Features Included (Core + Viral) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-slate-600 block">
            Features Included (Core + Viral Engine)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { title: 'Daily Horoscope', sub: '(Shareable)', icon: '🧘', color: 'from-amber-400 to-orange-500' },
              { title: 'Personalized Report', sub: '(With share option)', icon: '📊', color: 'from-blue-500 to-indigo-600' },
              { title: 'Multi-Profile', sub: '(Family / Friends)', icon: '👥', color: 'from-purple-500 to-pink-600' },
              { title: 'Push Notifications', sub: '(Engagement)', icon: '🔔', color: 'from-pink-500 to-rose-600' },
              { title: 'Social Sharing', sub: '(Go Viral)', icon: '🔗', color: 'from-teal-500 to-emerald-600' },
              { title: 'Premium Upgrade', sub: '(Advanced Insights)', icon: '👑', color: 'from-indigo-600 to-purple-600' },
            ].map((f, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xl block">{f.icon}</span>
                <strong className="text-xs text-slate-900 block leading-tight">{f.title}</strong>
                <span className="text-[10px] text-slate-500 block">{f.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Design Style & UI Blueprint */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-600 block">
            Design Style &amp; UI Blueprint
          </span>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span className="text-slate-600 font-medium">Primary Gradient</span>
              <span className="font-mono text-[10px] font-bold text-indigo-600">#667EEA → #764BA2</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span className="text-slate-600 font-medium">Background</span>
              <span className="font-mono text-[10px] font-bold text-slate-800">#F8FAFF</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span className="text-slate-600 font-medium">Dark Text</span>
              <span className="font-mono text-[10px] font-bold text-slate-900">#1F2937</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span className="text-slate-600 font-medium">Accent Green</span>
              <span className="font-mono text-[10px] font-bold text-emerald-600">#22C55E</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-600">
            <span className="px-2 py-0.5 rounded-md bg-slate-100">Clean &amp; Minimal</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100">Rounded UI</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100">Soft Shadows</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100">Modern Icons</span>
          </div>
        </div>

      </div>

    </div>
  );
}
