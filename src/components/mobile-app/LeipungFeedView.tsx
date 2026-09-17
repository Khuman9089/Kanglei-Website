'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Heart,
  Share2,
  Sparkles,
  Send,
  Image as ImageIcon,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Search,
  Filter,
  Flame,
  Megaphone,
  BookOpen,
  User,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ThumbsUp,
  MessageCircle,
  Clock,
  Tag,
  Copy,
  Check,
  ShieldAlert,
  Flag,
  UserX,
  WifiOff,
  Scale
} from 'lucide-react';

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

interface LeipungComment {
  id: string;
  post_id: string;
  author: Author;
  comment_text: string;
  created_at: string;
}

const CATEGORY_PRESETS = [
  '#লাংবন_তর্পণ',
  '#থৱান_পুর্নিমা',
  '#কুথি_ইবা',
  '#ꯍꯩꯔꯨ_ꯍꯤꯗꯣꯡꯕꯥ',
  '#পঞ্জিকা_খবর',
  '#Rituals',
  '#Culture',
  '#General'
];

const AVATAR_COLORS = [
  'bg-amber-600',
  'bg-emerald-600',
  'bg-blue-600',
  'bg-purple-600',
  'bg-rose-600',
  'bg-teal-600',
  'bg-indigo-600'
];

const REPORT_REASONS = [
  'Hate speech, harassment, or abusive attacks',
  'Nudity, pornography, or sexually explicit material',
  'Scam, financial fraud, or spam advertising',
  'Defamation or false religious misinformation',
  'Violence, threats, or dangerous content',
  'Other violation of Community Guidelines'
];

export default function LeipungFeedView() {
  const [posts, setPosts] = useState<LeipungPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'trending' | 'announcements' | 'rituals'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Active User Profile
  const [currentUser, setCurrentUser] = useState<Author>({
    id: 'user-guest',
    name: 'Romen Singh',
    badge: 'Community Member',
    color: 'bg-amber-600',
  });
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authNameInput, setAuthNameInput] = useState<string>('');
  const [authColorInput, setAuthColorInput] = useState<string>('bg-amber-600');

  // UGC Moderation, EULA & Safety States (Apple 1.2 & Google Play UGC)
  const [eulaAgreed, setEulaAgreed] = useState<boolean>(false);
  const [showEulaModal, setShowEulaModal] = useState<boolean>(false);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [reportingPost, setReportingPost] = useState<LeipungPost | null>(null);
  const [reportReason, setReportReason] = useState<string>(REPORT_REASONS[0]);
  const [reportDetails, setReportDetails] = useState<string>('');
  const [submittingReport, setSubmittingReport] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Post Composer State
  const [showComposer, setShowComposer] = useState<boolean>(false);
  const [composerText, setComposerText] = useState<string>('');
  const [composerCategory, setComposerCategory] = useState<string>('#লাংবন_তর্পণ');
  const [composerImage, setComposerImage] = useState<string>('');
  const [submittingPost, setSubmittingPost] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User Reactions Tracker
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [khurumjariPosts, setKhurumjariPosts] = useState<Record<string, boolean>>({});

  // Active Comment Drawer State
  const [activePostIdForComments, setActivePostIdForComments] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, LeipungComment[]>>({});
  const [commentInput, setCommentInput] = useState<string>('');
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);

  // Lightbox Media Modal
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load User Profile, EULA, and Blocked Users
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('leipung_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.name) setCurrentUser(parsed);
        } catch (e) {}
      }

      const agreed = localStorage.getItem('leipung_eula_agreed');
      if (agreed === 'true') {
        setEulaAgreed(true);
      }

      const blocked = localStorage.getItem('leipung_blocked_users');
      if (blocked) {
        try {
          setBlockedUsers(JSON.parse(blocked));
        } catch (e) {}
      }

      // Online / Offline Status
      setIsOnline(window.navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `/api/leipung/posts?filter=${activeFilter}`;
      if (selectedCategory !== 'all') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Error fetching Leipung posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeFilter, selectedCategory, searchQuery]);

  // EULA Acceptance Handler
  const handleAcceptEula = () => {
    setEulaAgreed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('leipung_eula_agreed', 'true');
    }
    setShowEulaModal(false);
    setShowComposer(true);
  };

  // Trigger Create Post with EULA Gate Check
  const handleTriggerCreatePost = () => {
    if (!eulaAgreed) {
      setShowEulaModal(true);
    } else {
      setShowComposer(true);
    }
  };

  // Block User Handler
  const handleBlockUser = (author: Author) => {
    const targetId = author.id || author.name;
    if (confirm(`Block ${author.name}? You will no longer see their posts or comments in Leipung.`)) {
      const updatedBlocked = [...new Set([...blockedUsers, targetId, author.name])];
      setBlockedUsers(updatedBlocked);
      if (typeof window !== 'undefined') {
        localStorage.setItem('leipung_blocked_users', JSON.stringify(updatedBlocked));
      }
      setActiveMenuPostId(null);
      showToast(`Blocked ${author.name}. Their posts have been hidden from your feed.`);
    }
  };

  // Submit Content Report
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingPost) return;

    setSubmittingReport(true);
    try {
      const res = await fetch(`/api/leipung/posts/${reportingPost.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterId: currentUser.id,
          reporterName: currentUser.name,
          reason: reportReason,
          details: reportDetails.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Report submitted. Our moderation team reviews flagged content within 24 hours.');
        setReportingPost(null);
        setReportDetails('');
      } else {
        alert(data.error || 'Failed to submit report');
      }
    } catch (err) {
      console.error('Report error:', err);
      alert('Network error while reporting content.');
    } finally {
      setSubmittingReport(false);
    }
  };

  // Handle User Profile Save
  const handleSaveUserProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authNameInput.trim()) return;
    const updatedUser: Author = {
      id: `user-${Date.now()}`,
      name: authNameInput.trim(),
      badge: 'Community Member',
      color: authColorInput,
    };
    setCurrentUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('leipung_user', JSON.stringify(updatedUser));
    }
    setShowAuthModal(false);
  };

  // Image Upload File Handler
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
      if (dataUrl) {
        setComposerImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit New Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim()) return;

    setSubmittingPost(true);
    try {
      const res = await fetch('/api/leipung/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: {
            ...currentUser,
            name: (authNameInput || currentUser.name || 'Community Member').trim(),
          },
          content_text: composerText.trim(),
          media_urls: composerImage ? [composerImage] : [],
          category_tag: composerCategory,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComposerText('');
        setComposerImage('');
        setShowComposer(false);
        fetchPosts();
        if (data.requires_approval) {
          showToast('Post submitted for admin verification.');
          alert('Khurumjari! Your post has been submitted for admin verification. It will appear on the public feed once approved by our moderator.');
        } else {
          showToast('Your post has been published to Leipung.');
        }
      } else {
        alert(data.error || 'Failed to submit post');
      }
    } catch (err) {
      console.error('Post submit error:', err);
      alert('Error submitting post to Leipung');
    } finally {
      setSubmittingPost(false);
    }
  };

  // Handle Like Toggle
  const handleToggleLike = async (postId: string) => {
    const isCurrentlyLiked = !!likedPosts[postId];
    const newLikedState = !isCurrentlyLiked;

    setLikedPosts((prev) => ({ ...prev, [postId]: newLikedState }));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes_count: Math.max(0, p.likes_count + (newLikedState ? 1 : -1)),
            }
          : p
      )
    );

    try {
      await fetch(`/api/leipung/posts/${postId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'like', is_active: newLikedState }),
      });
    } catch (e) {
      console.error('Reaction error:', e);
    }
  };

  // Handle Khurumjari Toggle
  const handleToggleKhurumjari = async (postId: string) => {
    const isCurrentlyKhurumjari = !!khurumjariPosts[postId];
    const newKhurumState = !isCurrentlyKhurumjari;

    setKhurumjariPosts((prev) => ({ ...prev, [postId]: newKhurumState }));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              khurumjari_count: Math.max(0, (p.khurumjari_count || 0) + (newKhurumState ? 1 : -1)),
            }
          : p
      )
    );

    try {
      await fetch(`/api/leipung/posts/${postId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'khurumjari', is_active: newKhurumState }),
      });
    } catch (e) {
      console.error('Reaction error:', e);
    }
  };

  // Fetch comments for a post
  const openCommentsDrawer = async (postId: string) => {
    setActivePostIdForComments(postId);
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/leipung/posts/${postId}/comments`);
      const data = await res.json();
      if (data.success) {
        setCommentsMap((prev) => ({ ...prev, [postId]: data.comments || [] }));
      }
    } catch (e) {
      console.error('Error fetching comments:', e);
    } finally {
      setLoadingComments(false);
    }
  };

  // Submit comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePostIdForComments || !commentInput.trim()) return;

    if (!eulaAgreed) {
      setShowEulaModal(true);
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/leipung/posts/${activePostIdForComments}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: currentUser,
          comment_text: commentInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setCommentsMap((prev) => ({
          ...prev,
          [activePostIdForComments]: [...(prev[activePostIdForComments] || []), data.comment],
        }));
        setPosts((prev) =>
          prev.map((p) =>
            p.id === activePostIdForComments ? { ...p, comments_count: p.comments_count + 1 } : p
          )
        );
        setCommentInput('');
      }
    } catch (e) {
      console.error('Error submitting comment:', e);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Share post handler
  const handleSharePost = (post: LeipungPost) => {
    const shareData = {
      title: 'Leipung • Kanglei Astro',
      text: `${post.author.name}: "${post.content_text.slice(0, 100)}..."`,
      url: typeof window !== 'undefined' ? `${window.location.origin}/app/leipung?post=${post.id}` : '',
    };
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share(shareData);
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(shareData.url);
      setCopiedPostId(post.id);
      setTimeout(() => setCopiedPostId(null), 2500);
    }
    setActiveMenuPostId(null);
  };

  const formatRelativeTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 5) return 'হৌজিক্মক (Just now)';
    if (diffMins < 60) return `${diffMins} মিনিট আগে`;
    if (diffHours < 24) return `${diffHours} ঘন্টা আগে`;
    return `${diffDays} দিন আগে`;
  };

  // Filter out posts authored by blocked users
  const visiblePosts = posts.filter(
    (p) =>
      !blockedUsers.includes(p.author?.id) &&
      !blockedUsers.includes(p.author?.name)
  );

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen text-slate-900 pb-20 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm">
          <div className="p-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-top-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="flex-1">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Offline Status Warning Banner */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs px-4 py-2 text-center font-medium flex items-center justify-center gap-2 sticky top-0 z-40">
          <WifiOff className="w-3.5 h-3.5" />
          <span>You are offline. Showing cached Leipung community posts.</span>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP LEIPUNG HEADER & FILTER TABS                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-xs font-black">
              ꯂ
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#111827] leading-tight flex items-center gap-1.5">
                <span>Leipung</span>
                <span className="text-amber-700 font-serif font-black">(ꯂꯩꯄꯨꯡ)</span>
              </h1>
              <span className="text-[10px] text-gray-500 font-serif block leading-none mt-0.5">
                Community Discussions & Culture
              </span>
            </div>
          </div>

          {/* User Profile Trigger & Search */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition cursor-pointer"
              title="Search posts"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthNameInput(currentUser.name);
                setAuthColorInput(currentUser.color || 'bg-amber-600');
                setShowAuthModal(true);
              }}
              className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition cursor-pointer"
              title="Edit User Profile"
            >
              <span className={`w-5 h-5 rounded-full ${currentUser.color || 'bg-amber-600'} text-white text-[10px] font-bold flex items-center justify-center`}>
                {currentUser.name.charAt(0)}
              </span>
              <span className="text-[11px] font-bold truncate max-w-[80px]">
                {currentUser.name}
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {showSearch && (
          <div className="px-4 pb-2.5 animate-in slide-in-from-top-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts, topics, or hashtags..."
                className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-gray-100 text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter Navigation Tabs Strip */}
        <div className="px-3 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Posts' },
            { id: 'trending', label: 'Trending 🔥' },
            { id: 'announcements', label: 'Announcements 📢' },
            { id: 'rituals', label: 'Rituals & Astrology 🪔' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. MAIN FEED CONTAINER                                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="max-w-[420px] mx-auto px-3.5 pt-3.5 space-y-3.5">
        
        {/* Create Post Trigger Card (Top of Feed) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${currentUser.color || 'bg-amber-600'} text-white font-bold flex items-center justify-center shrink-0 shadow-2xs`}>
              {currentUser.name.charAt(0)}
            </div>
            <button
              type="button"
              onClick={handleTriggerCreatePost}
              className="flex-1 text-left px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 text-xs font-medium border border-gray-200 transition cursor-pointer"
            >
              What's on your mind? / ꯋꯥꯈꯜꯂꯣꯟ ꯐꯣꯡꯗꯣꯛꯄꯤꯌꯨ...
            </button>
            <button
              type="button"
              onClick={() => {
                if (!eulaAgreed) {
                  setShowEulaModal(true);
                } else {
                  setShowComposer(true);
                  setTimeout(() => fileInputRef.current?.click(), 150);
                }
              }}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition cursor-pointer"
              title="Add photo"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="w-6 h-6 text-amber-600 animate-spin" />
            <span className="text-xs text-gray-500 font-medium font-serif">Loading Leipung Community Posts...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && visiblePosts.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center font-bold text-xl font-serif">
              ꯂ
            </div>
            <h3 className="text-sm font-bold text-gray-900">No community posts found</h3>
            <p className="text-xs text-gray-500">
              Be the first to share a post, ritual insight, or question in Leipung!
            </p>
            <button
              type="button"
              onClick={handleTriggerCreatePost}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition"
            >
              Create First Post
            </button>
          </div>
        )}

        {/* ── 3. POSTS TIMELINE ── */}
        {!loading &&
          visiblePosts.map((post) => {
            const isLiked = !!likedPosts[post.id];
            const isKhurumjari = !!khurumjariPosts[post.id];
            const totalEngagements = post.likes_count + (post.khurumjari_count || 0);

            return (
              <div
                key={post.id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-3.5 font-sans shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-2.5 transition relative"
              >
                {/* User Header */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    {/* User Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full ${
                        post.author.color || 'bg-amber-600'
                      } text-white flex items-center justify-center font-bold text-base shadow-2xs shrink-0`}
                    >
                      {post.author.name ? post.author.name.charAt(0) : 'U'}
                    </div>

                    {/* Author info & Metadata */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-[#111827] leading-tight">
                          {post.author.name}
                        </span>
                        {post.author.is_verified && (
                          <span title="Verified Astrologer" className="inline-flex">
                            <ShieldCheck className="w-4 h-4 text-amber-600 fill-amber-100" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#6B7280] leading-tight mt-0.5 flex items-center gap-1.5">
                        <span>{formatRelativeTime(post.created_at)}</span>
                        <span>•</span>
                        <span className="text-[#D97706] font-semibold">{post.category_tag || '#Leipung'}</span>
                        {post.is_pinned && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold uppercase">
                            PINNED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3-Dots Action Menu Trigger (UGC Moderation & Safety) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)
                      }
                      className="border-none bg-transparent text-[#9CA3AF] hover:text-gray-700 cursor-pointer p-1.5 rounded-full hover:bg-gray-100 transition"
                      title="Post Options (Report / Block / Share)"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenuPostId === post.id && (
                      <div className="absolute right-0 top-8 z-20 w-52 bg-white rounded-2xl shadow-xl border border-gray-200 py-1.5 text-xs animate-in fade-in duration-100">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuPostId(null);
                            setReportingPost(post);
                          }}
                          className="w-full px-3.5 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition cursor-pointer"
                        >
                          <Flag className="w-3.5 h-3.5 text-red-500" />
                          <span>Report Inappropriate</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBlockUser(post.author)}
                          className="w-full px-3.5 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium transition cursor-pointer"
                        >
                          <UserX className="w-3.5 h-3.5 text-gray-500" />
                          <span>Block @{post.author.name}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSharePost(post)}
                          className="w-full px-3.5 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium transition cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5 text-gray-500" />
                          <span>Share / Copy Link</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Body Text */}
                <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-line">
                  {post.content_text}
                </p>

                {/* Media Image Grid (if attached) */}
                {post.media_urls && post.media_urls.length > 0 && (
                  <div
                    className="w-full rounded-xl overflow-hidden border border-[#E5E7EB] cursor-pointer"
                    onClick={() => setLightboxImage(post.media_urls![0])}
                  >
                    <img
                      src={post.media_urls[0]}
                      alt="Shared photo"
                      className="w-full max-h-64 object-cover hover:scale-[1.01] transition duration-200"
                    />
                  </div>
                )}

                {/* Engagement Counters */}
                <div className="flex justify-between items-center text-xs text-[#6B7280] pb-2 border-b border-[#F3F4F6]">
                  <div className="flex items-center gap-1.5">
                    <span>❤️ 🙏 {totalEngagements} জন</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{post.comments_count} কমেন্ট</span>
                    <span>•</span>
                    <span>{post.shares_count || 0} শেয়ার</span>
                  </div>
                </div>

                {/* Action Buttons (Like, Khurumjari, Comment, Share) */}
                <div className="flex justify-around items-center pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 bg-transparent border-none text-[13px] font-semibold px-2.5 py-1.5 rounded-xl cursor-pointer transition ${
                      isLiked ? 'text-amber-600 font-bold bg-amber-50' : 'text-[#4B5563] hover:bg-gray-100'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-amber-600 text-amber-600' : ''}`} />
                    <span>Like</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleKhurumjari(post.id)}
                    className={`flex items-center gap-1.5 bg-transparent border-none text-[13px] font-semibold px-2.5 py-1.5 rounded-xl cursor-pointer transition ${
                      isKhurumjari ? 'text-amber-700 font-bold bg-amber-50' : 'text-[#4B5563] hover:bg-gray-100'
                    }`}
                    title="Khurumjari (Respectful Greeting)"
                  >
                    <span>🙏</span>
                    <span>Khurumjari</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openCommentsDrawer(post.id)}
                    className="flex items-center gap-1.5 bg-transparent border-none text-[13px] font-semibold text-[#4B5563] hover:bg-gray-100 px-2.5 py-1.5 rounded-xl cursor-pointer transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Comment</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSharePost(post)}
                    className="flex items-center gap-1.5 bg-transparent border-none text-[13px] font-semibold text-[#4B5563] hover:bg-gray-100 px-2.5 py-1.5 rounded-xl cursor-pointer transition"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Inline Comment Section if active */}
                {activePostIdForComments === post.id && (
                  <div className="pt-2 border-t border-gray-100 space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                      <span>Comments ({post.comments_count})</span>
                      <button
                        type="button"
                        onClick={() => setActivePostIdForComments(null)}
                        className="text-gray-400 hover:text-gray-700 cursor-pointer"
                      >
                        Close ✕
                      </button>
                    </div>

                    {/* Comments List (Excluding comments from blocked users) */}
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                      {loadingComments ? (
                        <div className="py-3 text-center text-xs text-gray-400">Loading comments...</div>
                      ) : (commentsMap[post.id] || []).filter(c => !blockedUsers.includes(c.author?.id) && !blockedUsers.includes(c.author?.name)).length === 0 ? (
                        <div className="py-3 text-center text-xs text-gray-400">
                          No comments yet. Be the first to reply!
                        </div>
                      ) : (
                        (commentsMap[post.id] || [])
                          .filter(c => !blockedUsers.includes(c.author?.id) && !blockedUsers.includes(c.author?.name))
                          .map((c) => (
                            <div key={c.id} className="p-2 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-0.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-900">{c.author.name}</span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  {formatRelativeTime(c.created_at)}
                                </span>
                              </div>
                              <p className="text-gray-700 text-[12px]">{c.comment_text}</p>
                            </div>
                          ))
                      )}
                    </div>

                    {/* Add Comment Input Bar */}
                    <form onSubmit={handleAddComment} className="flex items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Write a respectful reply..."
                        className="flex-1 px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                      <button
                        type="submit"
                        disabled={submittingComment || !commentInput.trim()}
                        className="p-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. TERMS OF USE (EULA) & COMMUNITY GUIDELINES MODAL           */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showEulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowEulaModal(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 z-10 space-y-4 animate-in zoom-in-95 duration-150 text-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Scale className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900">Leipung Community Guidelines</h3>
              <p className="text-[11px] text-slate-500">
                To keep our cultural and astrological community safe, you must agree to our Terms of Use (EULA) before posting or commenting.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-slate-700 space-y-1.5 text-[11px]">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Zero Tolerance Policy:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>No hate speech, harassment, or personal abuse.</li>
                <li>No nudity, pornography, or sexually explicit content.</li>
                <li>No spam, scam links, or defamatory remarks.</li>
                <li>Flagged posts are reviewed by admins within 24 hours.</li>
              </ul>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              By proceeding, you agree to our{' '}
              <Link href="/app/terms-of-service" target="_blank" className="text-amber-700 underline font-semibold">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/app/privacy-policy" target="_blank" className="text-amber-700 underline font-semibold">
                Privacy Policy
              </Link>.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEulaModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAcceptEula}
                className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-xs"
              >
                I Agree & Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. REPORT CONTENT MODAL (Apple 1.2 & Google Play Policy)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {reportingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setReportingPost(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 z-10 space-y-4 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2 text-red-600 font-bold">
                <Flag className="w-4 h-4" />
                <span>Report Inappropriate Content</span>
              </div>
              <button
                type="button"
                onClick={() => setReportingPost(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600 text-[11px]">
              Our admin moderation team will investigate this report within 24 hours. Objectionable content will be removed immediately.
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Additional Details (Optional)</label>
                <textarea
                  rows={2}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Describe why this post violates guidelines..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReportingPost(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  {submittingReport ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Flag className="w-3.5 h-3.5" />}
                  <span>{submittingReport ? 'Submitting...' : 'Submit Report'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. SLIDE-UP POST COMPOSER MODAL                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowComposer(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 z-10 space-y-4 animate-in slide-in-from-bottom duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-xs">
                  ꯂ
                </div>
                <h3 className="text-sm font-bold text-gray-900">Create Leipung Post</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Author Identification */}
            <div className="flex items-center gap-2.5 bg-amber-50/70 p-2.5 rounded-2xl border border-amber-200/70">
              <div className={`w-8 h-8 rounded-full ${currentUser.color || 'bg-amber-600'} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                {(authNameInput || currentUser.name || 'C').charAt(0)}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={authNameInput}
                  onChange={(e) => {
                    setAuthNameInput(e.target.value);
                    setCurrentUser((prev) => ({ ...prev, name: e.target.value || 'Community Member' }));
                  }}
                  placeholder="Your Name (e.g. Sanatomba Meitei)"
                  className="w-full px-2.5 py-1 rounded-xl bg-white border border-amber-300 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">
                  Verified by admin before appearing publicly • No account required
                </span>
              </div>
            </div>

            {/* Composer Form */}
            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <textarea
                  rows={4}
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  placeholder="Share ritual experiences, ask astrology queries, or discuss Manipuri culture (Meetei Mayek / বাংলা / English)..."
                  className="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                  required
                />
                <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                  <span>Supports Meetei Mayek & Bengali script</span>
                  <span>{composerText.length}/500</span>
                </div>
              </div>

              {/* Category Selector Chips */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1.5">Select Topic Tag</label>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {CATEGORY_PRESETS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setComposerCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                        composerCategory === cat
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Uploader & Preview */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />

              {composerImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-amber-300">
                  <img src={composerImage} alt="Upload preview" className="w-full h-36 object-cover" />
                  <button
                    type="button"
                    onClick={() => setComposerImage('')}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center text-xs cursor-pointer hover:bg-black"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-300 hover:border-amber-500 bg-gray-50/60 flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 transition cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>Attach Temple / Ritual Photo (Optional)</span>
                </button>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingPost || !composerText.trim()}
                  className="w-full py-2.5 rounded-2xl bg-[#D97706] hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submittingPost ? 'Publishing...' : 'Post to Leipung'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. USER PROFILE / AUTH MODAL                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowAuthModal(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 z-10 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Leipung Community Profile</h3>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUserProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Your Full Name / Handle</label>
                <input
                  type="text"
                  value={authNameInput}
                  onChange={(e) => setAuthNameInput(e.target.value)}
                  placeholder="e.g. Romen Singh"
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1.5">Avatar Color</label>
                <div className="flex items-center gap-2">
                  {AVATAR_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setAuthColorInput(col)}
                      className={`w-7 h-7 rounded-full ${col} transition cursor-pointer border-2 ${
                        authColorInput === col ? 'border-amber-950 scale-110' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Quick links to Privacy and Account Settings */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <Link
                  href="/app/settings/account"
                  className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-between font-medium"
                >
                  <span>Account Settings & Privacy</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 8. LIGHTBOX MEDIA VIEWER                                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-xl p-2 rounded-full bg-white/10"
            onClick={() => setLightboxImage(null)}
          >
            ✕
          </button>
          <img
            src={lightboxImage}
            alt="Enlarged media"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}

    </div>
  );
}
