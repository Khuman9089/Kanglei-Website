'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageCircle, 
  Building2, Sparkles, ShieldCheck, ArrowRight, User, HelpCircle,
  ExternalLink
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface BranchOffice {
  id: string;
  name: string;
  address: string;
  pincode?: string;
  phone?: string;
  email?: string;
  timing?: string;
}

interface ContactSettings {
  brandName: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  timing?: string;
  mapEmbedUrl?: string;
  branchOffices: BranchOffice[];
}

const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  brandName: 'KuthiYengpham by KangleiAstro',
  phone: '9999999999',
  email: 'ccare@kuthiyengpham.in',
  address: 'Khurai Chingangbam Leikai, Tinsid Road, Imphal East, Manipur',
  pincode: '795005',
  timing: 'Monday – Saturday: 9:30 AM – 6:00 PM IST',
  branchOffices: [],
};

export default function ContactPage() {
  const [contactSettings, setContactSettings] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Kuthi Yengba Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ id: string; msg: string } | null>(null);
  const [formError, setFormError] = useState('');
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);

  // 1. Fetch live contact and branch settings from API
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.contactSettings) {
          setContactSettings({
            ...DEFAULT_CONTACT_SETTINGS,
            ...data.contactSettings,
            branchOffices: Array.isArray(data.contactSettings.branchOffices) 
              ? data.contactSettings.branchOffices 
              : []
          });
        }
      })
      .catch((err) => console.warn('Using default contact settings:', err))
      .finally(() => setLoadingSettings(false));

    // 2. Auto-fill from signed-in user profile if available
    try {
      const stored = localStorage.getItem('kanglei_user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user && (user.name || user.email || user.phone || user.mobile)) {
          setIsLoggedInUser(true);
          if (user.name) setFullName(user.name);
          if (user.email) setEmail(user.email);
          if (user.phone || user.mobile || user.whatsappNo) {
            setPhone(user.phone || user.mobile || user.whatsappNo);
          }
        }
      }
    } catch (e) {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (!fullName.trim() || !message.trim()) {
      setFormError('Please provide your name and your inquiry message.');
      setSubmitting(false);
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setFormError('Please provide either an email address or a phone number so we can respond.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          phone,
          subject,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }

      setSubmittedTicket({
        id: data.ticketId || `INQ-${Date.now()}`,
        msg: data.message || 'Your inquiry has been submitted successfully!',
      });
      setMessage('');
    } catch (err: any) {
      setFormError(err.message || 'Something went wrong. Please try again or reach out via phone.');
    } finally {
      setSubmitting(false);
    }
  };

  const fullHeadAddress = `${contactSettings.address}${contactSettings.pincode ? `, Pin ${contactSettings.pincode}` : ''}`;
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${contactSettings.brandName}, ${fullHeadAddress}`
  )}`;

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans text-[#0f172a]">
      <Navbar />

      {/* Hero / Header Section */}
      <section className="bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white pt-28 pb-16 px-4 md:px-8 border-b border-amber-900/30 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Customer Support & Office Centers</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Contact <span className="text-[#fbbf24]">{contactSettings.brandName}</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Need guidance on your Manipuri Kuthi, horoscope calculation, astrologer consultation, or service orders? Reach out via our direct contact desk or visit our office.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-gray-300">
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{contactSettings.timing || 'Mon – Sat: 9:30 AM – 6:00 PM IST'}</span>
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Authentic Jyotish Support</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main 2-Column Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: CONTACT FORM (7 cols on large screens) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#fde68a]/70 shadow-xl space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#b45309] block">
                    ✦ Send a Direct Message
                  </span>
                  <h2 className="font-serif text-2xl font-black text-[#0f172a] mt-0.5">
                    Customer Inquiry Form
                  </h2>
                </div>
                {isLoggedInUser && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                    <User className="w-3 h-3 text-emerald-600" />
                    <span>Account Synced</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Fill in the form below and our dedicated support team will get back to you promptly.
              </p>
            </div>

            {formError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <span>⚠️ {formError}</span>
              </div>
            )}

            {submittedTicket ? (
              <div className="p-6 rounded-3xl bg-emerald-50/80 border border-emerald-300 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-emerald-950">
                  Inquiry Submitted Successfully!
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{fullName}</strong>. Your message has been safely logged in our system. Our client assistance coordinator will contact you via email or WhatsApp soon.
                </p>
                <div className="inline-block px-4 py-2 rounded-xl bg-white border border-emerald-200 font-mono text-xs font-bold text-emerald-900 shadow-xs">
                  Reference Ticket No: <span className="text-[#b45309]">{submittedTicket.id}</span>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmittedTicket(null)}
                    className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oinam Robert Singh"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-gray-200 text-xs font-medium text-gray-800 focus:border-[#d97706] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address <span className="text-gray-400 font-normal">(Optional if phone given)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-gray-200 text-xs font-medium text-gray-800 focus:border-[#d97706] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Phone / WhatsApp No. <span className="text-gray-400 font-normal">(Optional if email given)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9862012345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-gray-200 text-xs font-medium text-gray-800 focus:border-[#d97706] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Inquiry Topic / Service Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-gray-200 text-xs font-bold text-gray-800 focus:border-[#d97706] focus:bg-white focus:outline-none transition-all"
                  >
                    <option value="Kuthi Yengba Inquiry">Manipuri Kuthi Yengba & Kuthi Iba</option>
                    <option value="Astrology Consultation">Astrologer Live Chat & Call Consultation</option>
                    <option value="Horoscope Matching">Kundli / Pakna-Wainaba Matching</option>
                    <option value="Numit Leppa">Numit Leppa (Auspicious Date Selection)</option>
                    <option value="Order & Payment Query">E-Commerce Shop / Payment Query</option>
                    <option value="Office Visit & Appointments">Physical Office Visit & In-Person Appointment</option>
                    <option value="General Query">Other General Questions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Message / Query Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Please write your questions or details here. Mention birth details (Date, Time, Place) if relevant to your horoscope inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-gray-200 text-xs font-medium text-gray-800 focus:border-[#d97706] focus:bg-white focus:outline-none transition-all resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Your Inquiry...' : 'Submit Inquiry Message →'}</span>
                </button>
              </form>
            )}
          </div>

          {/* RIGHT SIDE: CONTACT DETAILS & BRANCH OFFICES (5 cols on large screens) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* HEAD OFFICE CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#fde68a]/70 shadow-lg space-y-5">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b45309] block">
                    Head Office & Central Desk
                  </span>
                  <h3 className="font-serif font-black text-lg sm:text-xl text-[#0f172a]">
                    {contactSettings.brandName}
                  </h3>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-3.5 text-xs">
                {/* Physical Address */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#faf8f5] border border-[#f3e8d2]">
                  <MapPin className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-gray-900 block">Registered Office Address</span>
                    <p className="text-gray-600 leading-relaxed">
                      {contactSettings.address}
                      {contactSettings.pincode ? `, Pin ${contactSettings.pincode}` : ''}
                    </p>
                    <a
                      href={mapSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#b45309] hover:underline pt-0.5"
                    >
                      <span>View Location on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Contact Number */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#faf8f5] border border-[#f3e8d2]">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 w-full">
                    <span className="font-bold text-gray-900 block">Contact Telephone / Helpline</span>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <a
                        href={`tel:${contactSettings.phone}`}
                        className="font-mono font-black text-sm text-[#0f172a] hover:text-[#b45309] transition-colors"
                      >
                        {contactSettings.phone}
                      </a>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${contactSettings.phone}`}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors"
                        >
                          Call Now
                        </a>
                        <a
                          href={`https://wa.me/91${contactSettings.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-[#25D366] text-white text-[11px] font-bold hover:opacity-95 transition-colors flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#faf8f5] border border-[#f3e8d2]">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-gray-900 block">Official Support Email</span>
                    <a
                      href={`mailto:${contactSettings.email}`}
                      className="font-mono font-bold text-xs text-blue-700 hover:underline block"
                    >
                      {contactSettings.email}
                    </a>
                    <span className="text-[10px] text-gray-500 block">Typical email response within 2–4 hours</span>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#faf8f5] border border-[#f3e8d2]">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-gray-900 block">Operating & Consultation Hours</span>
                    <p className="text-gray-600">{contactSettings.timing || 'Monday – Saturday: 9:30 AM – 6:00 PM IST'}</p>
                    <span className="text-[10px] text-amber-800 font-medium">Sunday: Closed for sacred temple ceremonies</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BRANCH OFFICES SECTION */}
            <div className="bg-white rounded-3xl p-6 border border-[#fde68a]/70 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#b45309]" />
                  <h4 className="font-serif font-bold text-base text-[#0f172a]">
                    Regional Branch Offices
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-gray-500">
                  {contactSettings.branchOffices.length} Active {contactSettings.branchOffices.length === 1 ? 'Branch' : 'Branches'}
                </span>
              </div>

              {contactSettings.branchOffices && contactSettings.branchOffices.length > 0 ? (
                <div className="space-y-3">
                  {contactSettings.branchOffices.map((branch, idx) => (
                    <div
                      key={branch.id || idx}
                      className="p-4 rounded-2xl bg-[#faf8f5] border border-gray-200 hover:border-amber-300 transition-colors space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">{branch.name}</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold">
                          Branch
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-[#b45309] shrink-0 mt-0.5" />
                        <p>{branch.address}{branch.pincode ? `, Pin ${branch.pincode}` : ''}</p>
                      </div>

                      {branch.phone && (
                        <div className="flex items-center gap-2 text-gray-600 pt-0.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <a href={`tel:${branch.phone}`} className="font-mono font-bold hover:underline">
                            {branch.phone}
                          </a>
                        </div>
                      )}

                      {branch.timing && (
                        <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                          <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                          <span>{branch.timing}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-center space-y-1">
                  <p className="text-xs font-semibold text-gray-700">
                    Additional branch offices across Manipur are being updated.
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Please visit our central Head Office at Khurai or contact our helpline for appointments.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Live Astrologer Consultation CTA */}
            <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-5 rounded-3xl border border-amber-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-[#fbbf24] text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Instant Astrology Advice</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Need immediate answers regarding horoscope matching or life decisions? Connect with verified Astrologers on live audio/video call.
              </p>
              <Link
                href="/astrologers"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#d97706] to-[#f59e0b] px-4 py-2 rounded-xl shadow-xs hover:opacity-95 transition-all"
              >
                <span>Consult Live Astrologers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
