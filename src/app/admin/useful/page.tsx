'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  ArrowLeft,
  Search,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Code,
  Save,
  Send,
  Smartphone,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface UsefulTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  content_html: string;
  is_published: boolean;
  updated_at: string;
}

const DEFAULT_CATEGORIES = [
  'Rituals',
  'Panchang Tips',
  'Muhurtas',
  'Festivals',
  'Holidays',
  'Astrology',
  'Guides'
];

export default function AdminUsefulPage() {
  const [topics, setTopics] = useState<UsefulTopic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [activeView, setActiveView] = useState<'list' | 'composer' | 'preview'>('list');

  // Composer Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('Rituals');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [contentHtml, setContentHtml] = useState<string>('');
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [htmlMode, setHtmlMode] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Live Preview Target
  const [previewTopic, setPreviewTopic] = useState<UsefulTopic | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/useful?all=true');
      const data = await res.json();
      if (data.success) {
        setTopics(data.topics || []);
      }
    } catch (err) {
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Sync contentHtml to contentEditable div when entering composer or switching mode
  useEffect(() => {
    if (activeView === 'composer' && !htmlMode && editorRef.current) {
      if (editorRef.current.innerHTML !== contentHtml) {
        editorRef.current.innerHTML = contentHtml || '<p>Start typing your topic guide content here...</p>';
      }
    }
  }, [activeView, htmlMode]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleStartCreate = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Rituals');
    setCustomCategory('');
    setSummary('');
    setContentHtml('<h2>Topic Title</h2><p>Provide detailed cultural, ritual or astrological explanation here...</p>');
    setIsPublished(true);
    setHtmlMode(false);
    setActiveView('composer');
  };

  const handleStartEdit = (topic: UsefulTopic) => {
    setEditingId(topic.id);
    setTitle(topic.title);
    setCategory(DEFAULT_CATEGORIES.includes(topic.category) ? topic.category : 'Other');
    setCustomCategory(DEFAULT_CATEGORIES.includes(topic.category) ? '' : topic.category);
    setSummary(topic.summary || '');
    setContentHtml(topic.content_html || '');
    setIsPublished(topic.is_published);
    setHtmlMode(false);
    setActiveView('composer');
  };

  const handleOpenPreview = (topic: UsefulTopic) => {
    setPreviewTopic(topic);
    setActiveView('preview');
  };

  const handleExecuteCommand = (command: string, value: string | undefined = undefined) => {
    if (htmlMode) return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
  };

  const handleSave = async (publishState: boolean) => {
    if (!title.trim()) {
      alert('Please enter a topic title.');
      return;
    }

    const currentHtml = htmlMode
      ? contentHtml
      : editorRef.current?.innerHTML || contentHtml;

    if (!currentHtml.trim()) {
      alert('Please enter some content for the topic.');
      return;
    }

    const finalCategory = category === 'Other' && customCategory.trim() ? customCategory.trim() : category;

    setSaving(true);
    try {
      if (editingId) {
        // Update
        const res = await fetch('/api/useful', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            title,
            category: finalCategory,
            summary,
            content_html: currentHtml,
            is_published: publishState,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast('Topic updated successfully!');
          await fetchTopics();
          setActiveView('list');
        } else {
          alert(data.error || 'Failed to update topic');
        }
      } else {
        // Create
        const res = await fetch('/api/useful', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            category: finalCategory,
            summary,
            content_html: currentHtml,
            is_published: publishState,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast('New topic created and saved successfully!');
          await fetchTopics();
          setActiveView('list');
        } else {
          alert(data.error || 'Failed to create topic');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, topicTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${topicTitle}"?`)) return;

    try {
      const res = await fetch(`/api/useful?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Topic deleted successfully');
        setTopics((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err: any) {
      alert(err.message || 'Network error');
    }
  };

  const handleTogglePublish = async (topic: UsefulTopic) => {
    try {
      const res = await fetch('/api/useful', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: topic.id,
          is_published: !topic.is_published,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTopics((prev) =>
          prev.map((t) => (t.id === topic.id ? { ...t, is_published: !t.is_published } : t))
        );
        showToast(`Topic is now ${!topic.is_published ? 'Published' : 'Draft'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTopics = topics.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategoryFilter === 'All' ||
      t.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-16">
      {/* Top Banner Header */}
      <header className="bg-[#1E1B18] text-white sticky top-0 z-30 shadow-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
            <div className="h-5 w-px bg-stone-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold leading-tight">Useful Info & Guide Composer</h1>
                <span className="text-[11px] text-amber-400 font-mono leading-none block">
                  Manipuri Astrology & Cultural Articles
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/app-control"
              className="px-3 py-1.5 rounded-xl border border-amber-800/60 bg-[#2b241d] hover:bg-[#382f26] text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>App Control Center</span>
            </Link>
            <Link
              href="/app/useful"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open User View</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-[#1E293B] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold border border-amber-500/40 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* View 1: Topics Manager Table */}
        {activeView === 'list' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles & rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['All', ...DEFAULT_CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedCategoryFilter === cat
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* New Topic Button */}
              <button
                type="button"
                onClick={handleStartCreate}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Compose New Topic</span>
              </button>
            </div>

            {/* Topics Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-800 text-sm">All Published & Draft Guides</h2>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                    {filteredTopics.length} Total
                  </span>
                </div>
                <button
                  type="button"
                  onClick={fetchTopics}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {loading ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading topics...
                </div>
              ) : filteredTopics.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-xs space-y-3">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="font-semibold text-slate-700">No useful guide topics found</p>
                  <p className="text-slate-400 max-w-sm mx-auto">
                    Create the first ritual or panchang guideline article using the composer above.
                  </p>
                  <button
                    type="button"
                    onClick={handleStartCreate}
                    className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Topic</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Title & Summary</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Last Updated</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTopics.map((topic) => (
                        <tr key={topic.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(topic)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer transition ${
                                topic.is_published
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                              }`}
                              title="Click to toggle publish status"
                            >
                              {topic.is_published ? (
                                <>
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  <span>Published</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  <span>Draft</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 max-w-md">
                            <span className="font-bold text-slate-900 text-[13px] block leading-snug">
                              {topic.title}
                            </span>
                            <span className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">
                              {topic.summary || 'No summary text provided'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                              {topic.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                            {new Date(topic.updated_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenPreview(topic)}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition"
                              title="Live Mobile Preview"
                            >
                              <Smartphone className="w-4 h-4 text-indigo-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(topic)}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition"
                              title="Edit Topic"
                            >
                              <Edit className="w-4 h-4 text-amber-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(topic.id, topic.title)}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-rose-600 transition"
                              title="Delete Topic"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View 2: Rich-Text / HTML Composer */}
        {activeView === 'composer' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 sm:p-7 space-y-6 max-w-4xl mx-auto">
            
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveView('list')}
                  className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition flex items-center gap-1 text-xs font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Topics</span>
                </button>
                <h2 className="text-base font-bold text-slate-900 ml-2">
                  {editingId ? 'Edit Useful Guide Topic' : 'Compose New Useful Topic'}
                </h2>
              </div>

              {/* Mode indicator */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHtmlMode(!htmlMode)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                    htmlMode
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{htmlMode ? 'HTML Source Mode' : 'WYSIWYG Mode'}</span>
                </button>
              </div>
            </div>

            {/* Inputs: Title, Category & Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Topic Title (Bengali / Meetei Mayek / English) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. লাংবন তর্পণ য়ৌবা নিয়ম অমসুং মতম"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Other">Custom Category...</option>
                </select>

                {category === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 mt-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                )}
              </div>
            </div>

            {/* Summary description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Short Summary (Card Preview Text)
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary explaining the significance for card previews..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* WYSIWYG Editor Toolbar */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Topic Content Body *</label>
              
              {!htmlMode && (
                <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100 border border-slate-200 rounded-t-2xl">
                  <button
                    type="button"
                    onClick={() => handleExecuteCommand('bold')}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
                    title="Bold (Ctrl+B)"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecuteCommand('italic')}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
                    title="Italic (Ctrl+I)"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecuteCommand('underline')}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
                    title="Underline"
                  >
                    <UnderlineIcon className="w-4 h-4" />
                  </button>
                  
                  <div className="h-4 w-px bg-slate-300 mx-1" />

                  <button
                    type="button"
                    onClick={() => handleExecuteCommand('formatBlock', '<h2>')}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition flex items-center gap-0.5 text-xs font-bold"
                    title="Heading 2"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecuteCommand('formatBlock', '<h3>')}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition flex items-center gap-0.5 text-xs font-bold"
                    title="Heading 3"
                  >
                    <Heading3 className="w-4 h-4" />
                  </button>

                  <div className="h-4 w-px bg-slate-300 mx-1" />

                  <button
                    type="button"
                    onClick={() => handleExecuteCommand('insertUnorderedList')}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
                    title="Bulleted List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecuteCommand('insertOrderedList')}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
                    title="Numbered List"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecuteCommand('formatBlock', '<blockquote>')}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
                    title="Quote Block"
                  >
                    <Quote className="w-4 h-4" />
                  </button>

                  <div className="h-4 w-px bg-slate-300 mx-1" />

                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Enter link URL:');
                      if (url) handleExecuteCommand('createLink', url);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
                    title="Insert Link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Editor Workspace */}
              {htmlMode ? (
                <textarea
                  rows={14}
                  value={contentHtml}
                  onChange={(e) => setContentHtml(e.target.value)}
                  className="w-full p-4 font-mono text-xs text-slate-900 bg-slate-900 text-emerald-400 rounded-2xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              ) : (
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={() => {
                    if (editorRef.current) setContentHtml(editorRef.current.innerHTML);
                  }}
                  className="min-h-[280px] max-h-[500px] overflow-y-auto p-4 bg-white border border-slate-200 rounded-b-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 prose prose-slate max-w-none text-sm leading-relaxed"
                />
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                  <span className="ml-3 text-xs font-bold text-slate-800">
                    {isPublished ? 'Publish to App Live' : 'Save as Draft'}
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const currentHtml = htmlMode
                      ? contentHtml
                      : editorRef.current?.innerHTML || contentHtml;
                    setPreviewTopic({
                      id: editingId || 'preview-temp',
                      title: title || 'Untitled Preview Topic',
                      category: category === 'Other' && customCategory ? customCategory : category,
                      summary: summary || '',
                      content_html: currentHtml,
                      is_published: isPublished,
                      updated_at: new Date().toISOString(),
                    });
                    setActiveView('preview');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>Live Mobile Preview</span>
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave(false)}
                  className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-700" />
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave(true)}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{saving ? 'Publishing...' : 'Publish Topic'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View 3: Live Mobile Preview Modal */}
        {activeView === 'preview' && previewTopic && (
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveView(editingId || title ? 'composer' : 'list')}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Editor</span>
              </button>
              <span className="text-xs font-bold text-slate-500">Android Reader Simulation</span>
            </div>

            {/* Mobile Device Frame */}
            <div className="w-full max-w-[412px] mx-auto rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.4),0_0_0_10px_#1E1B18] overflow-hidden bg-white border border-slate-200 flex flex-col min-h-[640px]">
              {/* Android Status Bar */}
              <div className="bg-[#121212] text-white text-[11px] px-6 pt-2 pb-1.5 flex items-center justify-between font-mono select-none">
                <span className="font-bold">09:41</span>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-300">
                  <span className="text-[9px] px-1 rounded bg-zinc-800 border border-zinc-700 font-sans">4G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Reader Header */}
              <div className="bg-[#1E1B18] text-white px-4 py-3 flex items-center justify-between border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveView(editingId || title ? 'composer' : 'list')}
                    className="p-1 rounded-full text-amber-300 hover:bg-white/10"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="font-serif font-bold text-xs text-amber-100 truncate max-w-[220px]">
                    {previewTopic.title}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-600/30 text-amber-300 font-bold border border-amber-500/40">
                  {previewTopic.category}
                </span>
              </div>

              {/* Reader Body Content */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4">
                <div className="space-y-1.5 border-b border-slate-100 pb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                    {previewTopic.category}
                  </span>
                  <h1 className="text-lg font-bold text-slate-900 leading-snug pt-1">
                    {previewTopic.title}
                  </h1>
                  <span className="text-[11px] text-slate-500 font-mono block">
                    Updated {new Date(previewTopic.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* HTML Body */}
                <div
                  className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed text-[13.5px]"
                  dangerouslySetInnerHTML={{ __html: previewTopic.content_html }}
                />
              </div>

              {/* Reader Bottom Navigation simulation */}
              <div className="bg-[#1E1B18] border-t border-stone-800 px-6 py-2 flex items-center justify-around text-[10px] text-zinc-400">
                <span>Home</span>
                <span>Calendar</span>
                <span>Panchang</span>
                <span className="text-amber-400 font-bold">Useful</span>
                <span>Rashifal</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
