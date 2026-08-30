'use client';

import React, { useState, useEffect, use } from 'react';
import { 
  ArrowLeft, Clock, Calendar, User, Sparkles, Share2, CheckCircle2, 
  Heart, Eye, MessageSquare, ShieldCheck, Award, ThumbsUp
} from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  readTime: string;
  publishedAt: string;
  views: number;
  likes: number;
  status: 'PUBLISHED' | 'DRAFT';
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) {
          const found = data.posts.find((p: BlogPost) => p.slug === resolvedParams.slug);
          setPost(found || data.posts[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching post:', err);
        setLoading(false);
      });
  }, [resolvedParams.slug]);

  const handleLike = async () => {
    if (!post || hasLiked) return;
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'LIKE', id: post.id }),
      });
      const data = await res.json();
      if (data.success) {
        setPost({ ...post, likes: data.likes });
        setHasLiked(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-[#faf8f4] flex flex-col font-sans">
        <main className="flex-1 pt-6 text-center text-sm font-bold">Loading article...</main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-[#faf8f4] flex flex-col font-sans">
        <main className="flex-1 pt-6 text-center">
          <h2 className="text-2xl font-serif font-bold mb-4 text-white">Article Not Found</h2>
          <Link href="/blog" className="text-[#fbbf24] font-bold hover:underline">← Back to Blog Directory</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#faf8f4] flex flex-col font-sans antialiased">
      <main className="flex-1 pt-1 sm:pt-2 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Navigation back */}
        <div>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#fbbf24] hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Vedic Journal</span>
          </Link>
        </div>

        {/* Article Header & Title */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-[#d97706] text-white text-xs font-extrabold uppercase shadow-xs">
              {post.category}
            </span>
            <span className="text-xs text-[#fbbf24] font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {post.views} Views
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
            {post.title}
          </h1>

          {/* Author Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[#3a506b]/50 py-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d97706] text-white font-bold text-sm flex items-center justify-center border border-[#fbbf24]/40">
                {post.author.charAt(0)}
              </div>
              <div>
                <span className="font-bold text-white block">{post.author}</span>
                <span className="text-[10px] text-gray-400 block">{post.authorRole || 'Vedic Astrology Specialist'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                disabled={hasLiked}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  hasLiked
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'bg-[#1c2541] text-gray-200 hover:text-white border-[#3a506b]'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-400' : ''}`} />
                <span>{hasLiked ? 'Liked!' : 'Like'} ({post.likes})</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out this article on KangleiAstro: ${post.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Share WA</span>
              </a>
            </div>
          </div>
        </div>

        {/* Cover Banner Image */}
        <div className="h-64 sm:h-96 rounded-3xl bg-cover bg-center border border-[#3a506b]/60 shadow-2xl relative overflow-hidden" style={{ backgroundImage: `url(${post.coverImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
        </div>

        {/* Excerpt Lead Summary Box */}
        <div className="bg-[#1c2541] p-6 rounded-2xl border-l-4 border-[#fbbf24] text-sm text-slate-200 font-medium leading-relaxed shadow-md">
          {post.excerpt}
        </div>

        {/* Article Body Content */}
        <div className="bg-[#1c2541] p-8 rounded-3xl border border-[#3a506b]/50 text-sm text-slate-200 leading-relaxed space-y-6 font-sans">
          {post.content.split('\n\n').map((paragraph, pIdx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={pIdx} className="font-serif font-bold text-2xl text-[#fbbf24] pt-4 pb-1 border-b border-[#3a506b]/40">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('> [!TIP]')) {
              return (
                <div key={pIdx} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#fbbf24] font-bold text-xs">
                  💡 {paragraph.replace('> [!TIP]', '').trim()}
                </div>
              );
            }
            if (paragraph.startsWith('- ')) {
              return (
                <ul key={pIdx} className="space-y-2.5 pl-2">
                  {paragraph.split('\n').map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      <span>{item.replace('- ', '')}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            return <p key={pIdx}>{paragraph}</p>;
          })}
        </div>

        {/* Author Bio Box */}
        <div className="p-6 rounded-3xl bg-[#1c2541] border border-[#3a506b]/60 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#d97706] text-white font-bold text-2xl flex items-center justify-center shrink-0 border-2 border-[#fbbf24]">
            {post.author.charAt(0)}
          </div>
          <div>
            <span className="text-[10px] text-[#fbbf24] uppercase font-bold tracking-wider block">Written By</span>
            <h4 className="font-serif font-bold text-xl text-white">{post.author}</h4>
            <p className="text-xs text-gray-400 mt-1">
              Senior Vedic Astrologer specializing in Moon Sign transits, Vimshottari Dasha calculations, and traditional Manipuri Kuthi readings.
            </p>
          </div>
        </div>

        {/* Consultation Call to Action Banner */}
        <div className="bg-gradient-to-r from-[#1c2541] via-[#0f172a] to-[#0b132b] p-8 rounded-3xl border border-[#3a506b] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#d97706] text-white text-[10px] font-extrabold uppercase mb-2 inline-block">
              Need Personal Guidance?
            </span>
            <h3 className="font-serif font-bold text-2xl text-[#fbbf24]">Get Your Kuthi Yengba Report (₹499)</h3>
            <p className="text-xs text-gray-300 mt-1 max-w-md">
              Upload your birth details or Kundali paper. Receive direct astrological remedies on your WhatsApp within 12 Hours.
            </p>
          </div>
          <Link
            href="/booking"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all shrink-0"
          >
            Kuthi Yengba Now →
          </Link>
        </div>

      </main>
    </div>
  );
}
