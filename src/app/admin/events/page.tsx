'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Flame,
  User,
  Phone,
  Sliders,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface CulturalEvent {
  id: string;
  titleEn: string;
  titleMeetei?: string;
  titleBengali?: string;
  dateStr: string;
  endDateStr?: string;
  timeStr?: string;
  venue: string;
  category: string;
  description: string;
  imageUrl?: string;
  organizer?: string;
  submitterName?: string;
  submitterContact?: string;
  status: 'approved' | 'pending' | 'rejected';
  isFeatured?: boolean;
  createdAt: string;
}

export default function AdminEventsManagementPage() {
  const [events, setEvents] = useState<CulturalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'create'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // New Event Form State
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleMeetei, setFormTitleMeetei] = useState('');
  const [formTitleBengali, setFormTitleBengali] = useState('');
  const [formDateStr, setFormDateStr] = useState('');
  const [formEndDateStr, setFormEndDateStr] = useState('');
  const [formTimeStr, setFormTimeStr] = useState('All Day');
  const [formVenue, setFormVenue] = useState('');
  const [formCategory, setFormCategory] = useState('festival');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formOrganizer, setFormOrganizer] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit Modal State
  const [editingEvent, setEditingEvent] = useState<CulturalEvent | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events?all=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.events)) {
        setEvents(data.events);
      }
    } catch (e) {
      console.error('Error fetching events:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Approve an event
  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Event approved & published to app!');
        fetchEvents();
      } else {
        alert(data.error || 'Failed to approve');
      }
    } catch (e) {
      alert('Network error approving event');
    }
  };

  // Reject an event
  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this event submission?')) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Event rejected.');
        fetchEvents();
      } else {
        alert(data.error || 'Failed to reject');
      }
    } catch (e) {
      alert('Network error rejecting event');
    }
  };

  // Delete an event
  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this event? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Event deleted successfully.');
        fetchEvents();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (e) {
      alert('Network error deleting event');
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (event: CulturalEvent) => {
    try {
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !event.isFeatured }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(event.isFeatured ? 'Removed from featured' : 'Marked as featured event!');
        fetchEvents();
      }
    } catch (e) {
      alert('Error updating featured status');
    }
  };

  // Create new event submission
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleEn.trim() || !formDateStr || !formVenue.trim()) {
      alert('Please fill in required fields: Title, Date, and Venue.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleEn: formTitleEn,
          titleMeetei: formTitleMeetei,
          titleBengali: formTitleBengali,
          dateStr: formDateStr,
          endDateStr: formEndDateStr,
          timeStr: formTimeStr,
          venue: formVenue,
          category: formCategory,
          description: formDescription,
          imageUrl: formImageUrl,
          organizer: formOrganizer,
          submitterName: 'Admin Desk',
          status: 'approved',
          isFeatured: formIsFeatured,
          isAdmin: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('New event created & published to app!');
        // Reset form
        setFormTitleEn('');
        setFormTitleMeetei('');
        setFormTitleBengali('');
        setFormDateStr('');
        setFormEndDateStr('');
        setFormTimeStr('All Day');
        setFormVenue('');
        setFormDescription('');
        setFormImageUrl('');
        setFormOrganizer('');
        setFormIsFeatured(false);
        setActiveTab('approved');
        fetchEvents();
      } else {
        alert(data.error || 'Failed to create event');
      }
    } catch (e) {
      alert('Error creating event');
    } finally {
      setSubmitting(false);
    }
  };

  // Save Edit Event
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      const res = await fetch(`/api/admin/events/${editingEvent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEvent),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Event updated successfully!');
        setEditingEvent(null);
        fetchEvents();
      } else {
        alert(data.error || 'Failed to update');
      }
    } catch (e) {
      alert('Error updating event');
    }
  };

  const pendingEvents = events.filter((e) => e.status === 'pending');
  const approvedEvents = events.filter((e) => e.status === 'approved');

  const filteredApproved = approvedEvents.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.titleEn.toLowerCase().includes(q) ||
      (e.titleMeetei && e.titleMeetei.includes(q)) ||
      (e.titleBengali && e.titleBengali.includes(q)) ||
      e.venue.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-16">
      
      {/* Top Navbar Header */}
      <header className="bg-[#1E1B18] text-white sticky top-0 z-30 shadow-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Admin</span>
            </Link>
            <div className="h-5 w-px bg-stone-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#c84b31] flex items-center justify-center text-white shadow-xs">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold leading-tight">Upcoming Events &amp; Festivals</h1>
                <span className="text-[11px] text-amber-400 font-mono leading-none block">
                  User Submissions Approval &amp; Cultural Event Publisher
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/app-control"
              className="px-3 py-1.5 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>App Control</span>
            </Link>
            <Link
              href="/app"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-[#c84b31] hover:bg-[#a6331b] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <span>Preview App</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 px-4 py-2.5 rounded-2xl bg-[#1E1B18] text-white text-xs font-bold border border-amber-500/40 shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* KPI Counter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase">Pending Review</span>
              <strong className="text-2xl font-black text-amber-600 block leading-tight">
                {pendingEvents.length}
              </strong>
              <span className="text-[11px] text-slate-400">User submitted events</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase">Live on App</span>
              <strong className="text-2xl font-black text-emerald-600 block leading-tight">
                {approvedEvents.length}
              </strong>
              <span className="text-[11px] text-slate-400">Published cultural events</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase">Featured Kumhei</span>
              <strong className="text-2xl font-black text-[#c84b31] block leading-tight">
                {events.filter((e) => e.isFeatured).length}
              </strong>
              <span className="text-[11px] text-slate-400">Carousel priority</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-[#c84b31] flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Pending Review</span>
              {pendingEvents.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black">
                  {pendingEvents.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'approved'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Published Events ({approvedEvents.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'create'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add New Event</span>
            </button>
          </div>

          <button
            type="button"
            onClick={fetchEvents}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 1: PENDING SUBMISSIONS APPROVAL WORKSPACE                 */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingEvents.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">All Caught Up!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  There are no pending event submissions from users waiting for review. New user submissions from the app will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-white rounded-3xl border-2 border-amber-300 p-5 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono text-[10px] font-bold uppercase">
                            User Submitted
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {new Date(evt.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-mono text-[10px] font-bold uppercase">
                            {evt.category}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#1a1c1e] mt-1">
                          {evt.titleEn}
                          {evt.titleMeetei && <span className="text-amber-700 font-medium ml-2 text-sm">/ {evt.titleMeetei}</span>}
                        </h3>
                      </div>

                      {/* Approval Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(evt.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve &amp; Publish</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingEvent(evt)}
                          className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition cursor-pointer"
                          title="Edit before approving"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(evt.id)}
                          className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition cursor-pointer"
                          title="Reject submission"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-gray-700">
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                        <div>
                          <span className="text-[10px] text-gray-400 block font-semibold">Event Date</span>
                          <strong className="text-gray-900 font-bold">{evt.dateStr} {evt.endDateStr ? `– ${evt.endDateStr}` : ''}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <MapPin className="w-4 h-4 text-[#c84b31] shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] text-gray-400 block font-semibold">Venue Location</span>
                          <strong className="text-gray-900 font-bold truncate block">{evt.venue}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <User className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] text-gray-400 block font-semibold">Submitted By</span>
                          <strong className="text-gray-900 font-bold truncate block">
                            {evt.submitterName || 'User'} {evt.submitterContact ? `(${evt.submitterContact})` : ''}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {evt.description && (
                      <p className="text-xs text-gray-600 leading-relaxed bg-[#f9f9fc] p-3 rounded-xl border border-gray-100">
                        {evt.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 2: PUBLISHED & APPROVED EVENTS LIST                       */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'approved' && (
          <div className="space-y-4">
            {/* Search filter bar */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <Search className="w-4 h-4 text-slate-400 ml-1" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, venue, festival name..."
                className="w-full text-xs text-slate-900 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredApproved.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* Event Header Banner */}
                    <div className="p-4 bg-gradient-to-r from-[#a6331b] to-[#c84b31] text-white space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="rounded-full bg-[#fead4d] px-2 py-0.5 text-[8.5px] font-bold text-[#2c1700] uppercase font-mono">
                          {evt.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(evt)}
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono transition cursor-pointer ${
                              evt.isFeatured
                                ? 'bg-amber-400 text-amber-950'
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                            title="Toggle featured priority in app carousel"
                          >
                            {evt.isFeatured ? '★ Featured' : '☆ Make Featured'}
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm sm:text-base leading-tight text-white mt-1">
                        {evt.titleEn}
                      </h4>
                      {evt.titleMeetei && (
                        <p className="text-xs text-amber-100 font-medium">{evt.titleMeetei}</p>
                      )}
                    </div>

                    {/* Event Body Info */}
                    <div className="p-4 space-y-2.5 text-xs text-gray-700">
                      <div className="flex items-center justify-between text-[11px] text-gray-600 border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <Calendar className="w-3.5 h-3.5 text-amber-700" />
                          <span>{evt.dateStr}</span>
                          {evt.timeStr && <span className="font-normal text-gray-500">({evt.timeStr})</span>}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 max-w-[50%] truncate">
                          <MapPin className="w-3 h-3 text-[#c84b31] shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {evt.description || 'No additional description provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-gray-400">
                      Added: {new Date(evt.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingEvent(evt)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(evt.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 3: CREATE & PUBLISH NEW UPCOMING EVENT FORM               */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <Plus className="w-5 h-5 text-[#c84b31]" />
              <h2 className="text-base font-bold text-slate-900">
                Publish New Upcoming Cultural Event / Festival
              </h2>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-800 block mb-1">
                    Event Title (English) *
                  </label>
                  <input
                    type="text"
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    placeholder="e.g. Heikru Hidongba Boat Race"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Category Tag
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                  >
                    <option value="festival">Cultural Festival (ꯀꯨꯝꯃꯩ)</option>
                    <option value="thabal">Thabal Chongba (ꯊꯥꯕꯜ ꯆꯣꯡꯕ)</option>
                    <option value="ritual">Temple Ritual &amp; Puja (ꯂꯥꯏ ꯈꯨꯔꯨꯝꯕ)</option>
                    <option value="kumhei">Sports &amp; Traditional Game</option>
                    <option value="community">Community Gathering</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Title in Meetei Mayek (Optional)
                  </label>
                  <input
                    type="text"
                    value={formTitleMeetei}
                    onChange={(e) => setFormTitleMeetei(e.target.value)}
                    placeholder="e.g. ꯌꯥꯎꯁꯪ ꯀꯨꯝꯃꯩ ꯑꯃꯁꯨꯡ ꯊꯥꯕꯜ ꯆꯣꯡꯕ"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Title in Bengali Script (Optional)
                  </label>
                  <input
                    type="text"
                    value={formTitleBengali}
                    onChange={(e) => setFormTitleBengali(e.target.value)}
                    placeholder="e.g. য়াওশং কুমহৈ ও থাবল চোংবা"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Start Date (YYYY-MM-DD) *
                  </label>
                  <input
                    type="date"
                    value={formDateStr}
                    onChange={(e) => setFormDateStr(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    End Date (If Multi-Day)
                  </label>
                  <input
                    type="date"
                    value={formEndDateStr}
                    onChange={(e) => setFormEndDateStr(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Timing
                  </label>
                  <input
                    type="text"
                    value={formTimeStr}
                    onChange={(e) => setFormTimeStr(e.target.value)}
                    placeholder="e.g. 07:30 PM Onwards or All Day"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Venue / Location *
                  </label>
                  <input
                    type="text"
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    placeholder="e.g. Kangla West Ground, Imphal"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Organizer Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formOrganizer}
                    onChange={(e) => setFormOrganizer(e.target.value)}
                    placeholder="e.g. Kangla Cultural Committee"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Banner Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://example.com/festival-banner.jpg"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Event Description &amp; Ritual Details
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detail the significance, schedule, guidelines, and cultural background..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="rounded border-gray-300 text-[#c84b31] focus:ring-[#c84b31]"
                />
                <label htmlFor="featuredCheckbox" className="font-semibold text-slate-800 cursor-pointer">
                  Feature this event prominently on mobile app homepage carousel
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('approved')}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#c84b31] hover:bg-[#a6331b] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{submitting ? 'Publishing...' : 'Publish Event to App'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Edit Event: {editingEvent.titleEn}
              </h3>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Title (English)</label>
                <input
                  type="text"
                  value={editingEvent.titleEn}
                  onChange={(e) => setEditingEvent({ ...editingEvent, titleEn: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Title (Meetei Mayek)</label>
                  <input
                    type="text"
                    value={editingEvent.titleMeetei || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, titleMeetei: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Category</label>
                  <input
                    type="text"
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Date</label>
                  <input
                    type="date"
                    value={editingEvent.dateStr}
                    onChange={(e) => setEditingEvent({ ...editingEvent, dateStr: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Timing</label>
                  <input
                    type="text"
                    value={editingEvent.timeStr || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, timeStr: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Venue</label>
                <input
                  type="text"
                  value={editingEvent.venue}
                  onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editFeaturedCheckbox"
                  checked={editingEvent.isFeatured || false}
                  onChange={(e) => setEditingEvent({ ...editingEvent, isFeatured: e.target.checked })}
                  className="rounded border-gray-300 text-[#c84b31]"
                />
                <label htmlFor="editFeaturedCheckbox" className="font-semibold text-slate-800 cursor-pointer">
                  Featured on Home Screen Carousel
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c84b31] hover:bg-[#a6331b] text-white font-bold text-xs shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
