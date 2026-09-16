'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Shield,
  Pin,
  Eye,
  EyeOff,
  Trash2,
  Send,
  Plus,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Heart,
  MessageCircle,
  Share2,
  Search,
  Filter,
  Megaphone,
  UserCheck,
  Tag,
  Flag,
  Check,
  X
} from 'lucide-react';
import Link from 'next/link';

interface Author {
  id: string;
  name: string;
  avatar_url?: string;
  badge?: string;
  is_verified?: boolean;
  color?: string;
}

interface LeipungPost {
  id: string;
  author: Author;
  content_text: string;
  media_urls?: string[];
  category_tag?: string;
  likes_count: number;
  khurumjari_count?: number;
  comments_count: number;
  shares_count: number;
  is_pinned?: boolean;
  is_hidden?: boolean;
  is_flagged?: boolean;
  report_count?: number;
  created_at: string;
}

interface LeipungReport {
  id: string;
  postId: string;
  contentType: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  details: string;
  status: string; // PENDING_REVIEW, DISMISSED, ACTION_TAKEN_HIDDEN, ACTION_TAKEN_DELETED
  created_at: string;
}

export default function AdminLeipungModerationPage() {
  const [posts, setPosts] = useState<LeipungPost[]>([]);
  const [reports, setReports] = useState<LeipungReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'reported' | 'active' | 'pinned' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  // Official Announcement Publisher State
  const [announcementText, setAnnouncementText] = useState<string>('');
  const [announcementCategory, setAnnouncementCategory] = useState<string>('#Official_Announcement');
  const [announcementImage, setAnnouncementImage] = useState<string>('');
  const [announcementPinned, setAnnouncementPinned] = useState<boolean>(true);
  const [publishing, setPublishing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPostsAndReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/leipung');
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error('Error loading admin leipung posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsAndReports();
  }, []);

  // Moderate Post Action
  const handleModerateAction = async (action: 'pin' | 'unpin' | 'hide' | 'unhide' | 'delete', postId: string) => {
    if (action === 'delete' && !confirm('Are you sure you want to delete this post permanently?')) {
      return;
    }
    try {
      const res = await fetch('/api/admin/leipung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, postId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Action completed successfully');
        fetchPostsAndReports();
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (err) {
      console.error('Moderation error:', err);
    }
  };

  // Moderate Report Action (Dismiss or Hide)
  const handleReportAction = async (action: 'dismiss_report' | 'action_report_hide', reportId: string, postId: string) => {
    try {
      const res = await fetch('/api/admin/leipung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reportId, postId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Report resolved');
        fetchPostsAndReports();
      } else {
        alert(data.error || 'Failed to update report');
      }
    } catch (e) {
      console.error('Report resolve error:', e);
    }
  };

  // Image Upload Handler for Announcement
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      alert('Please upload an image smaller than 2.5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) setAnnouncementImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Publish Official Announcement
  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    setPublishing(true);
    try {
      const res = await fetch('/api/admin/leipung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'official_post',
          postData: {
            content_text: announcementText.trim(),
            media_urls: announcementImage ? [announcementImage] : [],
            category_tag: announcementCategory,
            is_pinned: announcementPinned,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Official announcement published to Leipung feed');
        setAnnouncementText('');
        setAnnouncementImage('');
        fetchPostsAndReports();
      } else {
        alert(data.error || 'Failed to publish announcement');
      }
    } catch (err) {
      console.error('Publish error:', err);
      alert('Error publishing announcement');
    } finally {
      setPublishing(false);
    }
  };

  const pendingReports = reports.filter((r) => r.status === 'PENDING_REVIEW');

  // Filter posts based on search & tab
  const filteredPosts = posts.filter((p) => {
    if (statusFilter === 'reported') {
      return (p.report_count && p.report_count > 0) || p.is_flagged || reports.some(r => r.postId === p.id && r.status === 'PENDING_REVIEW');
    }
    if (statusFilter === 'active') return !p.is_hidden;
    if (statusFilter === 'pinned') return p.is_pinned;
    if (statusFilter === 'hidden') return p.is_hidden;
    return true;
  }).filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.content_text.toLowerCase().includes(q) ||
      p.author?.name.toLowerCase().includes(q) ||
      (p.category_tag && p.category_tag.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-16">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & NAVIGATION BAR                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Return to Main Admin Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-black shadow-xs">
              ꯂ
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight flex items-center gap-2">
                <span>Leipung Feed Moderation & UGC Safety</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Apple 1.2 & Google UGC Compliant
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Live moderation, 24h report review queue, post pinning & official broadcasts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app/leipung"
            target="_blank"
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <span>Preview Client Feed</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={fetchPostsAndReports}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 2. STATS & OVERVIEW STRIP                                     */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium block">Total Community Posts</span>
            <strong className="text-xl font-bold text-slate-900 mt-1 block">
              {posts.length}
            </strong>
          </div>
          <div className={`bg-white p-4 rounded-2xl border shadow-xs ${pendingReports.length > 0 ? 'border-red-300 bg-red-50/40' : 'border-slate-200'}`}>
            <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>Reported Queue (24h)</span>
              {pendingReports.length > 0 && (
                <span className="px-2 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">
                  Action Needed
                </span>
              )}
            </span>
            <strong className={`text-xl font-bold mt-1 block ${pendingReports.length > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {pendingReports.length} Flagged
            </strong>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium block">Active Visible Posts</span>
            <strong className="text-xl font-bold text-emerald-600 mt-1 block">
              {posts.filter((p) => !p.is_hidden).length}
            </strong>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium block">Hidden / Moderated</span>
            <strong className="text-xl font-bold text-rose-600 mt-1 block">
              {posts.filter((p) => p.is_hidden).length}
            </strong>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3. PENDING REPORTED CONTENT QUEUE (Apple 1.2 Requirement)     */}
        {/* ───────────────────────────────────────────────────────────── */}
        {pendingReports.length > 0 && (
          <div className="bg-red-50/60 border border-red-200 rounded-3xl p-5 space-y-3 shadow-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b border-red-200 pb-2.5">
              <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider">
                <Flag className="w-4 h-4 text-red-600" />
                <span>Pending User Reports Queue ({pendingReports.length})</span>
              </div>
              <span className="text-[11px] text-red-700 font-medium">
                Apple 24-Hour Review Window Policy
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingReports.map((report) => {
                const targetPost = posts.find((p) => p.id === report.postId);

                return (
                  <div key={report.id} className="p-3.5 rounded-2xl bg-white border border-red-200 shadow-2xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Reporter: {report.reporterName}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-red-700 font-semibold bg-red-100 px-2 py-0.5 rounded-full text-[10px]">
                          {report.reason}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(report.created_at).toLocaleString()}
                      </span>
                    </div>

                    {report.details && (
                      <p className="text-slate-600 text-[11px] italic bg-slate-50 p-2 rounded-lg">
                        &quot;{report.details}&quot;
                      </p>
                    )}

                    {targetPost ? (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="text-[11px] font-bold text-slate-700">Author: {targetPost.author?.name}</div>
                        <p className="text-slate-800 text-xs">{targetPost.content_text}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Target post was already removed.</span>
                    )}

                    <div className="flex items-center gap-2 pt-1 justify-end">
                      <button
                        type="button"
                        onClick={() => handleReportAction('dismiss_report', report.id, report.postId)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
                      >
                        Dismiss (No Violation)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReportAction('action_report_hide', report.id, report.postId)}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer"
                      >
                        Hide Content & Resolve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModerateAction('delete', report.postId)}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition cursor-pointer"
                      >
                        Delete Permanently
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 4. OFFICIAL ANNOUNCEMENT PUBLISHER FORM                       */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-600" />
                <span>Publish Official Astrologer Announcement</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Post verified updates with official gold checkmark directly to the top of the Leipung community feed.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold font-mono">
              ★ Kanglei Astro Official
            </span>
          </div>

          <form onSubmit={handlePublishAnnouncement} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Announcement Content (Meetei Mayek / বাংলা / English)
              </label>
              <textarea
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Write official panchang alerts, festival notices, ritual guidelines, or app updates..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category Hashtag</label>
                <input
                  type="text"
                  value={announcementCategory}
                  onChange={(e) => setAnnouncementCategory(e.target.value)}
                  placeholder="#Official_Announcement"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Image Graphic (Optional)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-600" />
                    <span>Upload Image</span>
                  </button>
                  {announcementImage && (
                    <span className="text-[10px] text-emerald-600 font-bold">✓ Attached</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-start sm:justify-end pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={announcementPinned}
                    onChange={(e) => setAnnouncementPinned(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-800">Pin to Top of Feed</span>
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={publishing || !announcementText.trim()}
                className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{publishing ? 'Publishing...' : 'Broadcast to Community'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 5. POSTS MODERATION TABLE & FILTER CONTROLLER                 */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          
          {/* Filter Bar & Search */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All Posts' },
                { id: 'reported', label: `🚩 Reported (${pendingReports.length})` },
                { id: 'active', label: 'Active (Visible)' },
                { id: 'pinned', label: '📌 Pinned' },
                { id: 'hidden', label: '🚫 Hidden' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    statusFilter === tab.id
                      ? tab.id === 'reported' ? 'bg-red-600 text-white shadow-xs' : 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search author, content, hashtag..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto min-w-[960px]">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Author & Info</th>
                  <th className="px-4 py-3">Post Content</th>
                  <th className="px-4 py-3">Category Tag</th>
                  <th className="px-4 py-3 text-center">Engagement</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No community posts matching this filter.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3.5 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full ${post.author?.color || 'bg-amber-600'} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                            {post.author?.name ? post.author.name.charAt(0) : 'U'}
                          </span>
                          <span className="font-bold text-slate-900">{post.author?.name}</span>
                          {post.author?.is_verified && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              Verified
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {new Date(post.created_at).toLocaleString()}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 max-w-sm">
                        <p className="text-slate-800 line-clamp-2 leading-relaxed">
                          {post.content_text}
                        </p>
                        {post.media_urls && post.media_urls.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-bold mt-1">
                            <ImageIcon className="w-3 h-3" />
                            <span>Photo Attached</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px]">
                          {post.category_tag || '#Leipung'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <span className="font-mono text-slate-700 font-bold">
                          ❤️ {post.likes_count} · 💬 {post.comments_count}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center whitespace-nowrap space-y-1">
                        {post.is_pinned && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] block">
                            📌 PINNED
                          </span>
                        )}
                        {post.is_hidden ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] block">
                            🚫 HIDDEN
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] block">
                            ✓ ACTIVE
                          </span>
                        )}
                        {post.report_count && post.report_count > 0 ? (
                          <span className="px-2 py-0.2 rounded-full bg-red-500 text-white font-bold text-[9px] block animate-pulse">
                            🚩 {post.report_count} Reports
                          </span>
                        ) : null}
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Pin / Unpin */}
                          <button
                            type="button"
                            onClick={() => handleModerateAction(post.is_pinned ? 'unpin' : 'pin', post.id)}
                            className={`p-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                              post.is_pinned
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                            title={post.is_pinned ? 'Unpin from Top' : 'Pin to Top of Feed'}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>

                          {/* Hide / Unhide */}
                          <button
                            type="button"
                            onClick={() => handleModerateAction(post.is_hidden ? 'unhide' : 'hide', post.id)}
                            className={`p-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                              post.is_hidden
                                ? 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                            title={post.is_hidden ? 'Unhide Post (Make Public)' : 'Hide Post from Feed'}
                          >
                            {post.is_hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleModerateAction('delete', post.id)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 transition cursor-pointer"
                            title="Delete Post Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      </main>
    </div>
  );
}
