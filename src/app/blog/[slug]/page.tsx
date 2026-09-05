'use client';

import React, { useState, useEffect, use } from 'react';
import { 
  ArrowLeft, Clock, Calendar, User, Sparkles, Share2, CheckCircle2, 
  Heart, Eye, MessageSquare, ShieldCheck, Award, ThumbsUp, Link2,
  Check, ArrowRight, BookOpen
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
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetch('/api/blog?t=' + Date.now(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.posts && Array.isArray(data.posts)) {
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

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdf5] text-[#0f172a] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#c69214] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-600">Opening sacred article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fffdf5] text-[#0f172a] flex flex-col items-center justify-center font-sans p-6">
        <div className="bg-white p-8 rounded-3xl border border-[#f3e8d2] shadow-sm text-center max-w-md space-y-4">
          <BookOpen className="w-10 h-10 text-[#c69214] mx-auto" />
          <h2 className="text-2xl font-serif font-bold text-[#0f172a]">Article Not Found</h2>
          <p className="text-xs text-gray-600">The requested astrological guide or transit forecast could not be located.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#c69214] text-white font-bold text-xs"
          >
            ← Back to Vedic Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffdf5] text-[#0f172a] font-sans antialiased selection:bg-[#fde68a] selection:text-[#b45309] pb-24">
      
      {/* Top Header Breadcrumbs Bar */}
      <div className="border-b border-[#f3e8d2] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-2 truncate">
            <Link href="/" className="hover:text-[#b45309]">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#b45309]">Vedic Journal</Link>
            <span>/</span>
            <span className="text-[#b45309] font-bold truncate max-w-[200px] sm:max-w-none">{post.category}</span>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b45309] hover:text-[#d97706] shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Articles</span>
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Article Header & Typography */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-extrabold uppercase tracking-wider border border-[#fde68a]">
              {post.category}
            </span>
            <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#c69214]" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#c69214]" />
              {post.readTime}
            </span>
            <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#c69214]" />
              {post.views.toLocaleString()} Views
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0f172a] leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Author Metadata & Social Interaction Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#f3e8d2] text-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-500 p-0.5 bg-white shrink-0">
                <img
                  src={post.authorAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80'}
                  alt={post.author}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="font-bold text-[#0f172a] flex items-center gap-1 text-sm">
                  {post.author}
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                </span>
                <span className="text-[11px] text-gray-500 block">{post.authorRole || 'Senior Vedic Scholar'}</span>
              </div>
            </div>

            {/* Interaction Buttons: Like, WhatsApp, Copy Link */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                disabled={hasLiked}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  hasLiked
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-gray-700 hover:text-rose-600 border-[#f3e8d2] hover:border-rose-200 shadow-2xs'
                }`}
                title="Like article"
              >
                <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{hasLiked ? 'Liked' : 'Like'} ({post.likes})</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 rounded-full bg-white text-gray-700 hover:text-[#b45309] border border-[#f3e8d2] text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Copy article link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out this astrological guide on KangleiAstro: "${post.title}" - Read here: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </a>
            </div>
          </div>
        </header>

        {/* Big Editorial Cover Banner */}
        <div className="rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] relative bg-gray-100 border border-[#f3e8d2] shadow-sm">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Lead Excerpt Pull-Quote Box */}
        <div className="p-6 rounded-2xl bg-[#fffdfa] border-l-4 border-[#c69214] border-y border-r border-[#f3e8d2] shadow-2xs">
          <p className="font-serif italic text-base sm:text-lg text-gray-800 leading-relaxed">
            &ldquo;{post.excerpt}&rdquo;
          </p>
        </div>

        {/* Clean Editorial Markdown or Rich HTML Body Container */}
        <article className="bg-white p-6 sm:p-10 rounded-3xl border border-[#f3e8d2] shadow-xs text-sm sm:text-base text-gray-800 leading-relaxed space-y-6 font-sans">
          {/<([a-z][a-z0-9]*)\b[^>]*>/i.test(post.content) ? (
            <div
              className="blog-rich-content prose max-w-none text-gray-800 text-sm sm:text-base leading-relaxed space-y-4 font-sans [&>h2]:font-serif [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:text-[#0f172a] [&>h2]:pt-6 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-[#f3e8d2] [&>h2]:tracking-tight [&>h3]:font-serif [&>h3]:font-bold [&>h3]:text-xl [&>h3]:sm:text-2xl [&>h3]:text-[#0f172a] [&>h3]:pt-4 [&>h4]:font-serif [&>h4]:font-bold [&>h4]:text-lg [&>h4]:text-[#b45309] [&>p]:leading-relaxed [&>blockquote]:p-5 [&>blockquote]:rounded-2xl [&>blockquote]:bg-[#fefaf0] [&>blockquote]:border-l-4 [&>blockquote]:border-[#d97706] [&>blockquote]:font-serif [&>blockquote]:italic [&>blockquote]:text-gray-800 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>figure]:my-6 [&>figure>img]:rounded-2xl [&>figure>img]:shadow-md [&>figure>figcaption]:text-xs [&>figure>figcaption]:text-gray-500 [&>figure>figcaption]:italic [&>figure>figcaption]:mt-2 [&>img]:rounded-2xl [&>img]:shadow-md [&>img]:my-6 [&>a]:text-[#b45309] [&>a]:font-bold [&>a]:underline hover:[&>a]:text-[#d97706] [&>hr]:my-6 [&>hr]:border-gray-200"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            post.content.split('\n\n').map((paragraph, pIdx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h2 key={pIdx} className="font-serif font-bold text-2xl sm:text-3xl text-[#0f172a] pt-6 pb-2 border-b border-[#f3e8d2] tracking-tight">
                    {paragraph.replace('### ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('> [!TIP]')) {
                return (
                  <div key={pIdx} className="p-4 rounded-2xl bg-[#fffbeb] border border-[#fde68a] text-[#b45309] font-medium text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
                    <Sparkles className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold mb-0.5 uppercase tracking-wider text-[10px] text-[#d97706]">Astro Guidance Tip</strong>
                      <span>{paragraph.replace('> [!TIP]', '').trim()}</span>
                    </div>
                  </div>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={pIdx} className="space-y-2.5 pl-1">
                    {paragraph.split('\n').map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0 mt-1" />
                        <span className="text-gray-800">{item.replace('- ', '')}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={pIdx} className="leading-relaxed text-gray-700">
                  {paragraph}
                </p>
              );
            })
          )}
        </article>

        {/* Author Bio Box */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#f3e8d2] shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 p-0.5 bg-white shrink-0">
            <img
              src={post.authorAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80'}
              alt={post.author}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <span className="text-[10px] text-[#b45309] uppercase font-extrabold tracking-widest block">
              About The Author
            </span>
            <h4 className="font-serif font-bold text-xl text-[#0f172a]">{post.author}</h4>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
              Certified Vedic Jyotish Scholar with expertise in planetary transit calculations, Ashtakoot Gun Milan, Navamsha reading, and sacred Manipuri Kuthi Yengba consultations.
            </p>
            <div className="pt-2">
              <Link
                href="/astrologers"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b45309] hover:text-[#d97706] hover:underline"
              >
                <span>Consult with verified astrologers →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Consultation Call to Action Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#fef3c7] via-[#fffbeb] to-[#fde68a]/60 p-7 md:p-9 border border-[#fde68a] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-[#d97706] text-white text-[10px] font-extrabold uppercase tracking-wider inline-block">
              Need Personal Astrological Reading?
            </span>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#0f172a]">
              Order Handwritten Kuthi Yengba Analysis
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Upload your birth date and time. Receive deep Vimshottari Dasha calculations, gemstone remedies, and full audio report within 12 hours.
            </p>
          </div>

          <Link
            href="/booking"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 transition-opacity shrink-0 flex items-center gap-2"
          >
            <span>Book Reading Session →</span>
          </Link>
        </div>

      </main>

    </div>
  );
}
