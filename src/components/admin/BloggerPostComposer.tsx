'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered,
  Quote, Code, Minus, RemoveFormatting, Link as LinkIcon, Image as ImageIcon,
  Video, Undo, Redo, Eye, Save, X, Check, ChevronDown, Sparkles, Tag,
  Calendar, Clock, User, Globe, FileText, Upload, Trash2, Edit3,
  CheckCircle2, AlertCircle, HelpCircle, ExternalLink, Type, Palette,
  Highlighter, BookOpen, Layers, MessageSquare, Sun, Moon
} from 'lucide-react';
import { BlogPost } from '@/app/api/blog/route';

interface BloggerPostComposerProps {
  post: Partial<BlogPost>;
  theme?: 'light' | 'dark';
  onSave: (savedPost: BlogPost) => Promise<void>;
  onClose: () => void;
  astrologersList?: { name: string; avatar?: string; specialty?: string }[];
}

// Curated Astrological Stock Photos for instant 1-click blog hero/body images
const ASTRO_STOCK_IMAGES = [
  {
    title: 'Vedic Kundli & Chart Scroll',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Night Sky & Planetary Orbit',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Sacred Traditional Marriage Ritual',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Temple Diya & Spiritual Offering',
    url: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Precious Navratna Astrological Gemstones',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Ancient Palmistry & Hand Lines',
    url: 'https://images.unsplash.com/photo-1515940175183-6798b29c4565?q=80&w=1200&auto=format&fit=crop',
  },
];

// Color palette options for text color and background highlight
const TEXT_COLORS = [
  { label: 'Default Black', value: '#0f172a' },
  { label: 'Vedic Gold / Amber', value: '#d97706' },
  { label: 'Deep Ochre', value: '#b45309' },
  { label: 'Sacred Crimson / Maroon', value: '#991b1b' },
  { label: 'Emerald Green', value: '#047857' },
  { label: 'Royal Indigo', value: '#3730a3' },
  { label: 'Midnight Blue', value: '#1e3a8a' },
  { label: 'Muted Gray', value: '#64748b' },
];

const HIGHLIGHT_COLORS = [
  { label: 'None', value: 'transparent' },
  { label: 'Soft Amber Yellow', value: '#fef3c7' },
  { label: 'Golden Peach', value: '#ffedd5' },
  { label: 'Mint Herbal', value: '#d1fae5' },
  { label: 'Sky Blue', value: '#e0f2fe' },
  { label: 'Rose Petal', value: '#ffe4e6' },
  { label: 'Lavender Dusk', value: '#ede9fe' },
];

const PRESET_CATEGORIES = [
  'Transits & Dashas',
  'Marriage Compatibility',
  'Vedic Guidance',
  'Planetary Remedies',
  'Kundli Analysis',
  'Manipuri Kuthi Tradition',
  'Panchang & Muhurat',
  'Gemology & Rudraksha',
  'Career & Wealth Jyotish',
];

export default function BloggerPostComposer({
  post,
  theme = 'light',
  onSave,
  onClose,
  astrologersList = [],
}: BloggerPostComposerProps) {
  // Core Post Metadata States
  const [title, setTitle] = useState(post.title || '');
  const [slug, setSlug] = useState(post.slug || '');
  const [category, setCategory] = useState(post.category || 'Transits & Dashas');
  const [author, setAuthor] = useState(post.author || 'Master Astrologer');
  const [authorRole, setAuthorRole] = useState(post.authorRole || 'Senior Vedic Scholar');
  const [authorAvatar, setAuthorAvatar] = useState(
    post.authorAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80'
  );
  const [coverImage, setCoverImage] = useState(
    post.coverImage || ASTRO_STOCK_IMAGES[0].url
  );
  const [excerpt, setExcerpt] = useState(post.excerpt || '');
  const [publishedAt, setPublishedAt] = useState(
    post.publishedAt || new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>(post.status || 'PUBLISHED');
  const [isFeatured, setIsFeatured] = useState(!!post.isFeatured);

  // Content & Editor View Mode ('compose' = WYSIWYG, 'html' = raw HTML view)
  const [viewMode, setViewMode] = useState<'compose' | 'html'>('compose');
  const [htmlContent, setHtmlContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'details' | 'media' | 'seo'>('details');

  // Dialog Modals
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageSize, setImageSize] = useState<'small' | 'medium' | 'large' | 'full'>('large');
  const [imageAlign, setImageAlign] = useState<'left' | 'center' | 'right'>('center');

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const [calloutModalOpen, setCalloutModalOpen] = useState(false);
  const [calloutType, setCalloutType] = useState<'tip' | 'mantra' | 'transit'>('tip');
  const [calloutTitle, setCalloutTitle] = useState('Vedic Astrological Guidance');
  const [calloutText, setCalloutText] = useState('');

  // Dropdown menus
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  // Initialize initial content
  useEffect(() => {
    let initialHtml = post.content || '';
    // If it's legacy plaintext / markdown, convert to friendly HTML
    if (initialHtml && !/<[a-z][\s\S]*>/i.test(initialHtml)) {
      initialHtml = initialHtml
        .split('\n\n')
        .map((p) => {
          if (p.startsWith('### ')) return `<h2>${p.replace('### ', '')}</h2>`;
          if (p.startsWith('> [!TIP]')) {
            return `<blockquote class="astro-callout"><strong>Astro Guidance Tip:</strong> ${p.replace('> [!TIP]', '').trim()}</blockquote>`;
          }
          if (p.startsWith('- ')) {
            const listItems = p
              .split('\n')
              .map((li) => `<li>${li.replace('- ', '')}</li>`)
              .join('');
            return `<ul>${listItems}</ul>`;
          }
          return `<p>${p}</p>`;
        })
        .join('');
    }

    if (!initialHtml) {
      initialHtml = `<p>Write your Vedic astrological insights, planetary transit analysis, and sacred remedies here...</p>`;
    }

    setHtmlContent(initialHtml);
    if (editorRef.current) {
      editorRef.current.innerHTML = initialHtml;
    }
  }, []);

  // Sync contentEditable with htmlContent when switching between 'compose' and 'html' view
  const handleToggleViewMode = (newMode: 'compose' | 'html') => {
    if (newMode === viewMode) return;
    if (newMode === 'html') {
      // Compose -> HTML
      if (editorRef.current) {
        setHtmlContent(editorRef.current.innerHTML);
      }
    } else {
      // HTML -> Compose
      if (editorRef.current) {
        editorRef.current.innerHTML = htmlContent;
      }
    }
    setViewMode(newMode);
  };

  // Keep htmlContent updated on input
  const handleContentInput = () => {
    if (editorRef.current) {
      setHtmlContent(editorRef.current.innerHTML);
    }
  };

  // Word count & Read time calculation
  const getCleanText = () => {
    if (typeof window === 'undefined') return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const cleanText = getCleanText();
  const wordCount = cleanText.trim() ? cleanText.trim().split(/\s+/).length : 0;
  const charCount = cleanText.length;
  const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 180));
  const autoReadTime = `${estimatedMinutes} min read`;

  // Auto-slug generator from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!post.id) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
    if (!excerpt && val) {
      setExcerpt(val);
    }
  };

  // Save current selection for modal restorations
  const saveSelection = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (typeof window === 'undefined') return;
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  };

  // Rich Text Execution
  const executeCommand = (command: string, value: string = '') => {
    if (viewMode === 'html') return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    handleContentInput();
  };

  // Format Block (Paragraph, Heading 2, Heading 3, Heading 4, Blockquote)
  const formatHeading = (tag: string) => {
    setShowHeadingMenu(false);
    if (viewMode === 'html') return;
    executeCommand('formatBlock', tag);
  };

  // Insert Link
  const handleApplyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl) return;
    restoreSelection();

    const targetAttr = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const displayText = linkText || linkUrl;
    const linkHtml = `<a href="${linkUrl}"${targetAttr} class="text-[#b45309] font-bold underline hover:text-[#d97706]">${displayText}</a>`;

    if (viewMode === 'html') {
      setHtmlContent((prev) => prev + linkHtml);
    } else {
      executeCommand('insertHTML', linkHtml);
    }

    setLinkModalOpen(false);
    setLinkText('');
    setLinkUrl('');
  };

  // Insert Image
  const handleApplyImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    restoreSelection();

    const sizeClass =
      imageSize === 'small'
        ? 'max-w-xs'
        : imageSize === 'medium'
        ? 'max-w-md'
        : imageSize === 'large'
        ? 'max-w-2xl'
        : 'w-full';

    const alignClass =
      imageAlign === 'left'
        ? 'mr-auto text-left'
        : imageAlign === 'right'
        ? 'ml-auto text-right'
        : 'mx-auto text-center';

    const imageHtml = `
      <figure class="my-6 ${alignClass}">
        <img src="${imageUrl}" alt="${imageCaption || title}" class="rounded-2xl shadow-md ${sizeClass} inline-block border border-[#f3e8d2]" />
        ${imageCaption ? `<figcaption class="text-xs text-gray-500 italic mt-2">${imageCaption}</figcaption>` : ''}
      </figure>
    `;

    if (viewMode === 'html') {
      setHtmlContent((prev) => prev + '\n' + imageHtml);
    } else {
      executeCommand('insertHTML', imageHtml);
    }

    setImageModalOpen(false);
    setImageUrl('');
    setImageCaption('');
  };

  // Image Upload File Handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Insert Video Embed
  const handleApplyVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;
    restoreSelection();

    let embedSrc = videoUrl;
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const vidId = videoUrl.split('watch?v=')[1]?.split('&')[0];
      embedSrc = `https://www.youtube.com/embed/${vidId}`;
    } else if (videoUrl.includes('youtu.be/')) {
      const vidId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      embedSrc = `https://www.youtube.com/embed/${vidId}`;
    }

    const videoHtml = `
      <div class="my-6 aspect-video rounded-2xl overflow-hidden shadow-lg border border-[#f3e8d2] max-w-2xl mx-auto">
        <iframe src="${embedSrc}" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
      </div>
    `;

    if (viewMode === 'html') {
      setHtmlContent((prev) => prev + '\n' + videoHtml);
    } else {
      executeCommand('insertHTML', videoHtml);
    }

    setVideoModalOpen(false);
    setVideoUrl('');
  };

  // Insert Astro Special Callout Box
  const handleApplyCallout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calloutText) return;
    restoreSelection();

    const bgStyles =
      calloutType === 'tip'
        ? 'bg-amber-50/80 border-amber-300 text-[#92400e]'
        : calloutType === 'mantra'
        ? 'bg-orange-50/90 border-orange-300 text-[#7c2d12]'
        : 'bg-indigo-50/80 border-indigo-300 text-[#312e81]';

    const iconSymbol = calloutType === 'tip' ? '✨' : calloutType === 'mantra' ? '🕉️' : '🪐';

    const calloutHtml = `
      <div class="my-6 p-5 rounded-2xl border-l-4 ${bgStyles} shadow-xs font-sans">
        <div class="font-serif font-bold text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
          <span>${iconSymbol}</span>
          <span>${calloutTitle}</span>
        </div>
        <p class="text-xs sm:text-sm leading-relaxed">${calloutText}</p>
      </div>
    `;

    if (viewMode === 'html') {
      setHtmlContent((prev) => prev + '\n' + calloutHtml);
    } else {
      executeCommand('insertHTML', calloutHtml);
    }

    setCalloutModalOpen(false);
    setCalloutText('');
  };

  // Save Blog Post Handler
  const handleSave = async (targetStatus?: 'PUBLISHED' | 'DRAFT') => {
    const finalStatus = targetStatus || status;
    const finalContent = viewMode === 'compose' && editorRef.current ? editorRef.current.innerHTML : htmlContent;

    if (!title.trim()) {
      alert('Please enter an Article Title before saving.');
      return;
    }

    if (!finalContent.trim()) {
      alert('Article content cannot be empty.');
      return;
    }

    setIsSaving(true);
    const finalSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const updatedPost: BlogPost = {
      id: post.id || 'post-' + Date.now(),
      slug: finalSlug,
      title: title.trim(),
      excerpt: excerpt.trim() || title.trim(),
      content: finalContent,
      category: category || 'Transits & Dashas',
      coverImage: coverImage || ASTRO_STOCK_IMAGES[0].url,
      author: author || 'Master Astrologer',
      authorRole: authorRole || 'Senior Vedic Scholar',
      authorAvatar: authorAvatar,
      readTime: autoReadTime,
      publishedAt: publishedAt || new Date().toISOString().split('T')[0],
      views: post.views || 0,
      likes: post.likes || 0,
      isFeatured: isFeatured,
      status: finalStatus,
    };

    try {
      await onSave(updatedPost);
      setSaveSuccessMsg(`Article successfully ${finalStatus === 'PUBLISHED' ? 'published live' : 'saved as draft'}!`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Error saving blog article.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a]/70 backdrop-blur-xs flex flex-col font-sans text-[#0f172a]">
      {/* ─────────────────────────────────────────────────────────────
         1. TOP NAVIGATION & ACTION HEADER (BLOGGER.COM STYLE)
         ───────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#fde68a] px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 shadow-xs">
        {/* Left: Blogger / Brand Badge & Back Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Close & Discard"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d97706] to-[#f59e0b] text-white flex items-center justify-center font-serif font-black text-sm shadow-xs">
              B
            </div>
            <div className="hidden sm:block">
              <span className="font-serif font-bold text-xs text-[#0f172a] block leading-tight">
                Vedic Journal Composer
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {status === 'PUBLISHED' ? '🟢 Published Live' : '🟠 Draft Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Title input */}
        <div className="flex-1 max-w-2xl px-2">
          <input
            type="text"
            required
            placeholder="Title — Enter your Vedic astrology headline..."
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl border border-transparent hover:border-gray-200 focus:border-[#d97706] bg-[#fefcf6] text-sm sm:text-base font-serif font-bold text-[#0f172a] focus:outline-none transition-all placeholder:font-sans placeholder:font-normal placeholder:text-gray-400"
          />
        </div>

        {/* Right: Actions (Preview, Draft, Publish) */}
        <div className="flex items-center gap-2">
          {saveSuccessMsg && (
            <span className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{saveSuccessMsg}</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setPreviewOpen(!previewOpen)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              previewOpen
                ? 'bg-amber-100 text-[#b45309] border-amber-300 shadow-inner'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
            title="Preview Live Reader Experience"
          >
            <Eye className="w-4 h-4 text-[#d97706]" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave('DRAFT')}
            className="px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold cursor-pointer transition-all disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave('PUBLISHED')}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Publish Live'}</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
         2. THE FAMOUS BLOGGER.COM FORMATTING TOOLBAR RIBBON
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#fefcf6] border-b border-[#fde68a] px-4 py-2 flex flex-wrap items-center gap-1.5 text-xs text-gray-700 shrink-0 select-none overflow-x-auto">
        {/* Toggle: Compose View (Pen) vs HTML View (< >) */}
        <div className="flex items-center bg-white rounded-xl border border-gray-300 p-0.5 shadow-2xs mr-1">
          <button
            type="button"
            onClick={() => handleToggleViewMode('compose')}
            className={`px-2.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-all ${
              viewMode === 'compose'
                ? 'bg-[#d97706] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Compose View (Visual WYSIWYG Editor)"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Compose</span>
          </button>
          <button
            type="button"
            onClick={() => handleToggleViewMode('html')}
            className={`px-2.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-all ${
              viewMode === 'html'
                ? 'bg-[#0f172a] text-[#fbbf24] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="HTML View (Source Code)"
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden md:inline">&lt;HTML&gt;</span>
          </button>
        </div>

        <div className="h-5 w-px bg-gray-300 mx-0.5" />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => executeCommand('undo')}
          disabled={viewMode === 'html'}
          className="p-1.5 rounded-lg hover:bg-white text-gray-700 hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('redo')}
          disabled={viewMode === 'html'}
          className="p-1.5 rounded-lg hover:bg-white text-gray-700 hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-gray-300 mx-0.5" />

        {/* Paragraph / Heading Dropdown */}
        <div className="relative">
          <button
            type="button"
            disabled={viewMode === 'html'}
            onClick={() => setShowHeadingMenu(!showHeadingMenu)}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-gray-300 flex items-center gap-1.5 font-bold text-xs text-[#0f172a] disabled:opacity-40 cursor-pointer"
            title="Paragraph Format"
          >
            <Type className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Format</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showHeadingMenu && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl border border-gray-200 shadow-xl py-1 z-30 font-sans">
              <button
                type="button"
                onClick={() => formatHeading('p')}
                className="w-full text-left px-3 py-1.5 hover:bg-[#fef3c7] text-xs font-normal text-gray-800"
              >
                Normal Text (p)
              </button>
              <button
                type="button"
                onClick={() => formatHeading('h2')}
                className="w-full text-left px-3 py-1.5 hover:bg-[#fef3c7] text-base font-serif font-bold text-[#0f172a]"
              >
                Major Heading (H2)
              </button>
              <button
                type="button"
                onClick={() => formatHeading('h3')}
                className="w-full text-left px-3 py-1.5 hover:bg-[#fef3c7] text-sm font-serif font-bold text-[#b45309]"
              >
                Subheading (H3)
              </button>
              <button
                type="button"
                onClick={() => formatHeading('h4')}
                className="w-full text-left px-3 py-1.5 hover:bg-[#fef3c7] text-xs font-serif font-bold text-gray-700"
              >
                Minor Heading (H4)
              </button>
              <button
                type="button"
                onClick={() => formatHeading('blockquote')}
                className="w-full text-left px-3 py-1.5 hover:bg-[#fef3c7] text-xs italic text-gray-600 border-t border-gray-100"
              >
                Blockquote
              </button>
              <button
                type="button"
                onClick={() => formatHeading('pre')}
                className="w-full text-left px-3 py-1.5 hover:bg-[#fef3c7] text-xs font-mono text-gray-600"
              >
                Code Snippet
              </button>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-gray-300 mx-0.5" />

        {/* Font Style Buttons: Bold, Italic, Underline, Strikethrough */}
        <button
          type="button"
          disabled={viewMode === 'html'}
          onClick={() => executeCommand('bold')}
          className="p-1.5 rounded-lg hover:bg-white text-gray-800 font-bold hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={viewMode === 'html'}
          onClick={() => executeCommand('italic')}
          className="p-1.5 rounded-lg hover:bg-white text-gray-800 italic hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={viewMode === 'html'}
          onClick={() => executeCommand('underline')}
          className="p-1.5 rounded-lg hover:bg-white text-gray-800 underline hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={viewMode === 'html'}
          onClick={() => executeCommand('strikeThrough')}
          className="p-1.5 rounded-lg hover:bg-white text-gray-800 line-through hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-gray-300 mx-0.5" />

        {/* Text Color Picker */}
        <div className="relative">
          <button
            type="button"
            disabled={viewMode === 'html'}
            onClick={() => {
              setShowColorMenu(!showColorMenu);
              setShowHighlightMenu(false);
            }}
            className="p-1.5 rounded-lg hover:bg-white text-gray-800 hover:text-[#d97706] flex items-center gap-0.5 disabled:opacity-40 cursor-pointer"
            title="Text Color"
          >
            <Palette className="w-4 h-4 text-[#d97706]" />
            <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
          </button>
          {showColorMenu && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl border border-gray-200 shadow-xl p-2 z-30 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-1">
                Text Colors
              </span>
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    executeCommand('foreColor', c.value);
                    setShowColorMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50 text-xs text-left"
                >
                  <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: c.value }} />
                  <span style={{ color: c.value }} className="font-bold">{c.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Background Highlight Picker */}
        <div className="relative">
          <button
            type="button"
            disabled={viewMode === 'html'}
            onClick={() => {
              setShowHighlightMenu(!showHighlightMenu);
              setShowColorMenu(false);
            }}
            className="p-1.5 rounded-lg hover:bg-white text-gray-800 hover:text-[#d97706] flex items-center gap-0.5 disabled:opacity-40 cursor-pointer"
            title="Text Background Color (Highlighter)"
          >
            <Highlighter className="w-4 h-4 text-amber-500" />
            <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
          </button>
          {showHighlightMenu && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl border border-gray-200 shadow-xl p-2 z-30 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-1">
                Highlight Colors
              </span>
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    executeCommand('hiliteColor', c.value);
                    setShowHighlightMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50 text-xs text-left"
                >
                  <span className="w-3.5 h-3.5 rounded shrink-0 border border-gray-300" style={{ backgroundColor: c.value }} />
                  <span className="px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: c.value === 'transparent' ? '#fff' : c.value }}>
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-gray-300 mx-0.5" />

        {/* Insert Link */}
        <button
          type="button"
          onClick={() => {
            saveSelection();
            setLinkModalOpen(true);
          }}
          className="p-1.5 rounded-lg hover:bg-white text-gray-800 hover:text-[#d97706] cursor-pointer"
          title="Insert or Edit Link"
        >
          <LinkIcon className="w-4 h-4 text-[#d97706]" />
        </button>

        {/* Insert Image */}
        <button
          type="button"
          onClick={() => {
            saveSelection();
            setImageModalOpen(true);
          }}
          className="p-1.5 rounded-lg hover:bg-white text-gray-800 hover:text-[#d97706] cursor-pointer"
          title="Insert Image (Upload or Web URL)"
        >
          <ImageIcon className="w-4 h-4 text-[#d97706]" />
        </button>

        {/* Insert Video */}
        <button
          type="button"
          onClick={() => {
            saveSelection();
            setVideoModalOpen(true);
          }}
          className="p-1.5 rounded-lg hover:bg-white text-gray-800 hover:text-[#d97706] cursor-pointer"
          title="Insert Video (YouTube Embed)"
        >
          <Video className="w-4 h-4 text-[#d97706]" />
        </button>

        {/* Insert Astro Special Callout Box */}
        <button
          type="button"
          onClick={() => {
            saveSelection();
            setCalloutModalOpen(true);
          }}
          className="px-2.5 py-1.5 rounded-lg bg-[#fef3c7] hover:bg-[#fde68a] text-[#b45309] font-extrabold text-xs flex items-center gap-1 cursor-pointer border border-[#fde68a]"
          title="Insert Vedic Guidance Tip / Shloka Box"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
          <span>Astro Box</span>
        </button>

        <div className="h-5 w-px bg-gray-300 mx-0.5" />

        {/* Alignment Menu */}
        <button
          type="button"
          disabled={viewMode === 'html'}
          onClick={() => executeCommand('justifyLeft')}
          className="p-1.5 rounded-lg hover:bg-white text-gray-700 hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={viewMode === 'html'}
          onClick={() => executeCommand('justifyCenter')}
          className="p-1.5 rounded-lg hover:bg-white text-gray-700 hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={viewMode === 'html'}
          onClick={() => executeCommand('justifyRight')}
          className="p-1.5 rounded-lg hover:bg-white text-gray-700 hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={viewMode === 'html'}
          onClick={() => executeCommand('justifyFull')}
          className="p-1.5 rounded-lg hover:bg-white text-gray-700 hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-gray-300 mx-0.5" />

        {/* Lists */}
        <button
          type="button"
          disabled={viewMode === 'html'}
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-1.5 rounded-lg hover:bg-white text-gray-700 hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          title="Bulleted List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={viewMode === 'html'}
          onClick={() => executeCommand('insertOrderedList')}
          className="p-1.5 rounded-lg hover:bg-white text-gray-700 hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-gray-300 mx-0.5" />

        {/* Quotes, Horizontal Line, Clear Format */}
        <button
          type="button"
          disabled={viewMode === 'html'}
          onClick={() => formatHeading('blockquote')}
          className="p-1.5 rounded-lg hover:bg-white text-gray-700 hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={viewMode === 'html'}
          onClick={() => executeCommand('insertHorizontalRule')}
          className="p-1.5 rounded-lg hover:bg-white text-gray-700 hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          title="Insert Horizontal Divider Line"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={viewMode === 'html'}
          onClick={() => executeCommand('removeFormat')}
          className="p-1.5 rounded-lg hover:bg-white text-gray-700 hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
         3. MAIN EDITOR WORKSPACE + RIGHT POST SETTINGS SIDEBAR
         ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden bg-[#f8fafc]">
        {/* Main Editor Canvas */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl w-full mx-auto bg-white rounded-3xl border border-[#f3e8d2] shadow-sm flex-1 flex flex-col overflow-hidden min-h-[550px]">
            {/* Post Title Banner inside editor */}
            <div className="p-6 pb-2 border-b border-gray-100">
              <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#0f172a] leading-tight">
                {title || <span className="text-gray-300 font-sans font-normal italic">Post Title will appear here...</span>}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 font-mono">
                <span>Slug: /blog/{slug || 'untitled-article'}</span>
                <span>•</span>
                <span>Category: {category}</span>
                <span>•</span>
                <span>By {author}</span>
              </div>
            </div>

            {/* Visual Compose View or HTML View */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
              {viewMode === 'compose' ? (
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleContentInput}
                  className="outline-none min-h-[400px] text-gray-800 text-sm sm:text-base leading-relaxed space-y-4 font-sans focus:ring-0 [&>h2]:font-serif [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:text-[#0f172a] [&>h2]:pt-4 [&>h2]:pb-1 [&>h2]:border-b [&>h2]:border-[#f3e8d2] [&>h3]:font-serif [&>h3]:font-bold [&>h3]:text-xl [&>h3]:text-[#b45309] [&>h3]:pt-3 [&>blockquote]:p-4 [&>blockquote]:rounded-2xl [&>blockquote]:bg-[#fefaf0] [&>blockquote]:border-l-4 [&>blockquote]:border-[#d97706] [&>blockquote]:italic [&>blockquote]:text-gray-800 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1 [&>img]:rounded-2xl [&>img]:my-3 [&>a]:text-[#b45309] [&>a]:underline [&>hr]:my-5 [&>hr]:border-gray-200"
                  style={{ minHeight: '400px' }}
                />
              ) : (
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  placeholder="<!-- Write raw HTML markup code here... -->"
                  className="w-full h-full min-h-[450px] p-4 rounded-2xl bg-[#0b132b] text-[#fbbf24] font-mono text-xs sm:text-sm leading-relaxed border border-gray-700 focus:outline-none resize-none shadow-inner"
                />
              )}
            </div>

            {/* Bottom Status Bar */}
            <div className="bg-[#fffdfa] border-t border-[#f3e8d2] px-6 py-2.5 flex flex-wrap items-center justify-between text-xs text-gray-500 font-mono shrink-0">
              <div className="flex items-center gap-4">
                <span><strong>{wordCount}</strong> words</span>
                <span>•</span>
                <span><strong>{charCount}</strong> characters</span>
                <span>•</span>
                <span>Est. <strong>{autoReadTime}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#b45309]">
                <Check className="w-3.5 h-3.5" />
                <span>Blogger Engine Synced</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           4. RIGHT SIDEBAR: BLOGGER.COM POST SETTINGS DRAWER
           ───────────────────────────────────────────────────────────── */}
        <aside className="w-80 lg:w-96 bg-white border-l border-[#fde68a] overflow-y-auto flex flex-col shrink-0 shadow-lg">
          <div className="p-4 border-b border-[#fde68a] bg-[#fefcf6]">
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#b45309] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#d97706]" />
              <span>Post Settings</span>
            </span>
          </div>

          {/* Settings Tabs */}
          <div className="grid grid-cols-3 border-b border-gray-200 text-xs font-bold text-center bg-gray-50">
            <button
              type="button"
              onClick={() => setSidebarTab('details')}
              className={`py-2.5 transition-colors cursor-pointer ${
                sidebarTab === 'details'
                  ? 'bg-white text-[#d97706] border-b-2 border-[#d97706]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => setSidebarTab('media')}
              className={`py-2.5 transition-colors cursor-pointer ${
                sidebarTab === 'media'
                  ? 'bg-white text-[#d97706] border-b-2 border-[#d97706]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Cover
            </button>
            <button
              type="button"
              onClick={() => setSidebarTab('seo')}
              className={`py-2.5 transition-colors cursor-pointer ${
                sidebarTab === 'seo'
                  ? 'bg-white text-[#d97706] border-b-2 border-[#d97706]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              SEO & URL
            </button>
          </div>

          <div className="p-5 space-y-5 text-xs">
            {/* TAB 1: DETAILS */}
            {sidebarTab === 'details' && (
              <>
                {/* Status Toggle */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1.5">
                    Publication Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus('PUBLISHED')}
                      className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                        status === 'PUBLISHED'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      🟢 Published Live
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('DRAFT')}
                      className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                        status === 'DRAFT'
                          ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-xs'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      🟠 Draft Mode
                    </button>
                  </div>
                </div>

                {/* Category (Labels) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1.5">
                    Category / Label *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                  >
                    {PRESET_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author Selection */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1.5">
                    Author / Astrologer Name
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Acharya Tombi Sharma"
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                  />
                  {astrologersList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {astrologersList.slice(0, 4).map((a) => (
                        <button
                          key={a.name}
                          type="button"
                          onClick={() => {
                            setAuthor(a.name);
                            if (a.specialty) setAuthorRole(a.specialty);
                            if (a.avatar) setAuthorAvatar(a.avatar);
                          }}
                          className="px-2 py-0.5 rounded-full bg-gray-100 hover:bg-amber-100 text-[10px] font-bold text-gray-700 cursor-pointer"
                        >
                          {a.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Author Role */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1.5">
                    Author Designation / Role
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder="e.g. Master Astrologer (18+ Yrs)"
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-medium text-xs focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                {/* Published Date */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1.5">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                {/* Featured Toggle */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#b45309] block">Featured Post</span>
                    <span className="text-[10px] text-gray-500">Show in top hero slider on /blog</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-[#d97706] w-4 h-4 cursor-pointer"
                  />
                </div>
              </>
            )}

            {/* TAB 2: MEDIA & FEATURED COVER */}
            {sidebarTab === 'media' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1.5">
                    Featured Cover Image URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-mono text-xs focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                {/* Image Live Preview */}
                {coverImage && (
                  <div className="rounded-2xl overflow-hidden aspect-video border border-gray-200 relative shadow-sm">
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Curated Astrological Stock Presets */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#b45309] block mb-2">
                    Quick Astrological Cover Presets:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {ASTRO_STOCK_IMAGES.map((img) => (
                      <button
                        key={img.title}
                        type="button"
                        onClick={() => setCoverImage(img.url)}
                        className={`p-1.5 rounded-xl border text-left cursor-pointer transition-all ${
                          coverImage === img.url
                            ? 'border-[#d97706] bg-amber-50 ring-1 ring-[#d97706]'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <img src={img.url} alt={img.title} className="w-full h-14 object-cover rounded-lg mb-1" />
                        <span className="text-[10px] font-bold text-gray-800 line-clamp-1 block">{img.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TAB 3: SEO, PERMALINK & EXCERPT */}
            {sidebarTab === 'seo' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1.5">
                    Permalink / URL Slug
                  </label>
                  <div className="flex items-center rounded-xl border border-gray-300 bg-[#fefcf6] overflow-hidden focus-within:border-[#d97706]">
                    <span className="px-2.5 text-[11px] text-gray-500 font-mono bg-gray-100 py-2.5 border-r border-gray-200">
                      /blog/
                    </span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="saturn-sade-sati-remedies"
                      className="w-full h-10 px-3 bg-transparent text-[#0f172a] font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309]">
                      Search Description / Excerpt
                    </label>
                    <span className="text-[10px] font-mono text-gray-400">{excerpt.length}/160</span>
                  </div>
                  <textarea
                    rows={4}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Short summary for Google search results and blog article cards..."
                    className="w-full p-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] text-xs focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                {/* Google Search Snippet Preview */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Google SERP Preview
                  </span>
                  <p className="text-[#1a0dab] font-serif font-bold text-xs truncate">
                    {title || 'Article Headline | KangleiAstro'}
                  </p>
                  <p className="text-[10px] text-[#006621] font-mono truncate">
                    https://kangleiastro.com/blog/{slug || 'article-slug'}
                  </p>
                  <p className="text-[11px] text-gray-600 line-clamp-2">
                    {excerpt || 'Read comprehensive Vedic astrology guidance, horoscope readings, and planetary remedies.'}
                  </p>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* ─────────────────────────────────────────────────────────────
         5. MODAL: INSERT LINK DIALOG
         ───────────────────────────────────────────────────────────── */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border border-[#fde68a] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#0f172a] flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-[#d97706]" />
                <span>Insert or Edit Link</span>
              </h3>
              <button type="button" onClick={() => setLinkModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLink} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Text to Display
                </label>
                <input
                  type="text"
                  placeholder="e.g. Talk to Top Jyotishs"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Web Address (URL) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com or /astrologers"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-mono text-blue-600"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkNewTab}
                    onChange={(e) => setLinkNewTab(e.target.checked)}
                    className="rounded text-[#d97706]"
                  />
                  <span>Open this link in a new window (target="_blank")</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold shadow-sm"
                >
                  Apply Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         6. MODAL: INSERT IMAGE DIALOG
         ───────────────────────────────────────────────────────────── */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-[#fde68a] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#0f172a] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#d97706]" />
                <span>Insert Image</span>
              </h3>
              <button type="button" onClick={() => setImageModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyImage} className="space-y-4 text-xs">
              {/* Option 1: File Upload */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Upload From Computer
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-[#b45309] hover:file:bg-amber-200 cursor-pointer"
                />
              </div>

              {/* Option 2: Image URL */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Or Paste Image Web URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-mono"
                />
              </div>

              {/* Image Preview */}
              {imageUrl && (
                <div className="rounded-xl overflow-hidden aspect-video border border-gray-200 relative bg-gray-50">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}

              {/* Quick Preset Images */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                  Pick Astrological Preset:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {ASTRO_STOCK_IMAGES.map((img) => (
                    <button
                      key={img.title}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      className="p-1 rounded-lg border border-gray-200 hover:border-amber-400 text-left cursor-pointer"
                    >
                      <img src={img.url} alt={img.title} className="w-full h-12 object-cover rounded mb-0.5" />
                      <span className="text-[9px] font-bold text-gray-700 truncate block">{img.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Image Caption / Alt Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sacred Vedic Planetary Diagram"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs"
                />
              </div>

              {/* Size & Alignment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                    Image Size
                  </label>
                  <select
                    value={imageSize}
                    onChange={(e) => setImageSize(e.target.value as any)}
                    className="w-full h-9 px-2.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-bold"
                  >
                    <option value="small">Small (300px)</option>
                    <option value="medium">Medium (500px)</option>
                    <option value="large">Large (800px)</option>
                    <option value="full">Full Width (100%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                    Alignment
                  </label>
                  <select
                    value={imageAlign}
                    onChange={(e) => setImageAlign(e.target.value as any)}
                    className="w-full h-9 px-2.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-bold"
                  >
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setImageModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold shadow-sm"
                >
                  Insert Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         7. MODAL: INSERT VIDEO DIALOG
         ───────────────────────────────────────────────────────────── */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border border-[#fde68a] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#0f172a] flex items-center gap-2">
                <Video className="w-5 h-5 text-[#d97706]" />
                <span>Insert YouTube / Media Video</span>
              </h3>
              <button type="button" onClick={() => setVideoModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyVideo} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  YouTube / Video Web URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-mono"
                />
              </div>

              <p className="text-[11px] text-gray-500">
                Supports YouTube URLs, youtu.be short links, or direct embedded video streams.
              </p>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold shadow-sm"
                >
                  Embed Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         8. MODAL: ASTRO SPECIAL GUIDANCE BOX DIALOG
         ───────────────────────────────────────────────────────────── */}
      {calloutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border border-[#fde68a] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#0f172a] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d97706]" />
                <span>Insert Astro Special Box</span>
              </h3>
              <button type="button" onClick={() => setCalloutModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyCallout} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Box Theme Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCalloutType('tip');
                      setCalloutTitle('Vedic Astrological Guidance');
                    }}
                    className={`py-2 rounded-xl font-bold border text-xs cursor-pointer ${
                      calloutType === 'tip' ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-white border-gray-200'
                    }`}
                  >
                    ✨ Astro Tip
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalloutType('mantra');
                      setCalloutTitle('Sacred Shloka / Mantra');
                    }}
                    className={`py-2 rounded-xl font-bold border text-xs cursor-pointer ${
                      calloutType === 'mantra' ? 'bg-orange-100 border-orange-400 text-orange-900' : 'bg-white border-gray-200'
                    }`}
                  >
                    🕉️ Shloka
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalloutType('transit');
                      setCalloutTitle('Planetary Transit Alert');
                    }}
                    className={`py-2 rounded-xl font-bold border text-xs cursor-pointer ${
                      calloutType === 'transit' ? 'bg-indigo-100 border-indigo-400 text-indigo-900' : 'bg-white border-gray-200'
                    }`}
                  >
                    🪐 Transit
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Box Header Title
                </label>
                <input
                  type="text"
                  value={calloutTitle}
                  onChange={(e) => setCalloutTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  Highlighted Guidance Text *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Always verify with your D9 Navamsha chart before wearing gemstones during Rahu Mahadasha..."
                  value={calloutText}
                  onChange={(e) => setCalloutText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCalloutModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold shadow-sm"
                >
                  Insert Box
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         9. MODAL: LIVE PREVIEW READER EXPERIENCE
         ───────────────────────────────────────────────────────────── */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl border border-[#fde68a] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-4 bg-[#fef3c7] border-b border-[#fde68a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#b45309]" />
                <span className="font-serif font-bold text-sm text-[#b45309]">
                  Live Reader Preview Mode (/blog/{slug || 'preview'})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/50 text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] font-black uppercase tracking-wider border border-[#fde68a]">
                  {category}
                </span>
                <span className="text-gray-500 font-mono">•</span>
                <span className="text-gray-500 font-mono">{publishedAt}</span>
                <span className="text-gray-500 font-mono">•</span>
                <span className="text-gray-500 font-mono">{autoReadTime}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0f172a] leading-tight">
                {title || 'Untitled Article Headline'}
              </h1>

              {/* Author bar */}
              <div className="flex items-center gap-3 py-3 border-y border-[#f3e8d2]">
                <img src={authorAvatar} alt={author} className="w-10 h-10 rounded-full object-cover border" />
                <div>
                  <span className="font-bold text-xs text-[#0f172a] block">{author}</span>
                  <span className="text-[11px] text-gray-500">{authorRole}</span>
                </div>
              </div>

              {/* Cover Banner */}
              {coverImage && (
                <div className="rounded-2xl overflow-hidden aspect-[21/9] border border-[#f3e8d2] shadow-sm">
                  <img src={coverImage} alt={title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Excerpt */}
              {excerpt && (
                <div className="p-5 rounded-2xl bg-[#fffdfa] border-l-4 border-[#d97706] italic font-serif text-base text-gray-800">
                  &ldquo;{excerpt}&rdquo;
                </div>
              )}

              {/* Rich Body Content */}
              <div
                className="prose max-w-none text-gray-800 text-sm sm:text-base leading-relaxed space-y-4 font-sans [&>h2]:font-serif [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:text-[#0f172a] [&>h2]:pt-4 [&>h2]:pb-1 [&>h2]:border-b [&>h2]:border-[#f3e8d2] [&>h3]:font-serif [&>h3]:font-bold [&>h3]:text-xl [&>h3]:text-[#b45309] [&>h3]:pt-3 [&>blockquote]:p-4 [&>blockquote]:rounded-2xl [&>blockquote]:bg-[#fefaf0] [&>blockquote]:border-l-4 [&>blockquote]:border-[#d97706] [&>blockquote]:italic [&>blockquote]:text-gray-800 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1 [&>img]:rounded-2xl [&>img]:my-3 [&>a]:text-[#b45309] [&>a]:underline [&>hr]:my-5 [&>hr]:border-gray-200"
                dangerouslySetInnerHTML={{
                  __html: viewMode === 'compose' && editorRef.current ? editorRef.current.innerHTML : htmlContent,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
