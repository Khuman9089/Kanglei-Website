'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, RotateCcw, ChevronLeft, Bot, MessageSquare } from 'lucide-react';
import { BirthProfile, ZodiacSignInfo } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface AstroGuruDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BirthProfile;
  zodiac: ZodiacSignInfo;
  dominantElement?: string;
  ascendantSign?: string;
}

export function AstroGuruDrawer({
  isOpen,
  onClose,
  profile,
  zodiac,
  dominantElement = 'Fire',
  ascendantSign
}: AstroGuruDrawerProps) {
  const [personality, setPersonality] = useState<'friendly' | 'mystic' | 'modern'>('friendly');
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'guru'; text: string }>>([
    {
      sender: 'guru',
      text: `Namaste ${profile.name}! I am AstroGuru, your personal celestial intelligence guide. Ask me anything about your ${zodiac.name} traits, 2026 transits, career moves, or relationship compatibility!`
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const hasTimeAndPlace = Boolean(profile.timeOfBirth && profile.birthPlace);

  const handleSend = async (customText?: string) => {
    const q = (customText || inputQuery).trim();
    if (!q || isTyping) return;

    setMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setInputQuery('');
    setIsTyping(true);

    let reply = '';

    // Check if online and query live endpoint
    if (typeof window !== 'undefined' && navigator.onLine) {
      try {
        const res = await fetch('/api/jyoti/oracle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: q,
            personality,
            language: 'English',
            astrologySystem: 'Vedic',
            chartContext: {
              ascendantSign: ascendantSign || (hasTimeAndPlace ? zodiac.name : 'Unknown (DOB Only)'),
              dominantElement: zodiac.element,
              hasTimeAndPlace,
            },
            userProfile: {
              name: profile.name,
              birthDate: profile.dateOfBirth,
              birthTime: profile.timeOfBirth,
              birthPlace: profile.birthPlace,
              sunSign: zodiac.name,
              element: zodiac.element,
            },
            conversationHistory: messages.slice(-6)
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.response) {
            reply = data.response;
          }
        }
      } catch (err) {
        // Fall back to rule-based engine
      }
    }

    // High quality offline fallback with explicit DOB disclosure when TOB is missing
    if (!reply) {
      const lower = q.toLowerCase();
      const dobPrefix = !hasTimeAndPlace
        ? `> [!NOTE]\n> *Your birth time and place are not yet provided, so this is a **Quick DOB-Based Insight** based on your **${zodiac.name} Sun**.*\n\n`
        : '';

      if (lower.includes('career') || lower.includes('job') || lower.includes('work') || lower.includes('business')) {
        reply = `${dobPrefix}### 💼 Vocational Guidance for ${profile.name}\n\nUnder your **${zodiac.name}** signature (${zodiac.element} element):\n\n- **Core Strength**: You excel in positions requiring clear leadership, strategic problem solving, and intellectual autonomy.\n- **Growth Opportunities**: Focus on building high-integrity systems and specialized skills during 2026.\n- **Actionable Step**: Identify one routine bottleneck this week and delegate or automate it.\n\n💡 **Key Takeaway**: Grounded daily execution compounds into major professional breakthroughs.`;
      } else if (lower.includes('love') || lower.includes('relationship') || lower.includes('marriage') || lower.includes('partner')) {
        reply = `${dobPrefix}### ❤️ Relationship Harmony & Tendencies\n\nLooking at your ${zodiac.name} placements:\n\n- **Emotional Language**: You value authenticity, mutual respect, and intellectual camaraderie.\n- **Harmony Windows**: Highest synergy is found with complementary **${zodiac.element === 'Fire' ? 'Air and Fire' : 'Earth and Water'}** temperaments.\n- **Communication Advice**: Transparent, calm boundary-setting prevents minor assumptions from growing into misunderstandings.\n\n💡 **Key Takeaway**: Lasting love thrives when both freedom and devotion are honored.`;
      } else if (lower.includes('focus') || lower.includes('month') || lower.includes('today')) {
        reply = `${dobPrefix}### 🎯 Your Cosmic Focus for this Period\n\n- **Current Energy Theme**: A season of shedding unnecessary noise to prioritize high-compounding goals.\n- **Mindset**: Trust your intuitive timing; avoid hasty reactions during emotional lunar phases.\n- **Daily Ritual**: Take 5 minutes at sunrise for quiet breathwork and hydration.\n\n💡 **Practical Advice**: Focus on what is directly within your control today.`;
      } else {
        reply = `${dobPrefix}### ✨ Cosmic Insight for ${profile.name}\n\nYour **${zodiac.name}** placement reflects **${zodiac.trait}**:\n\n- **Natural Gifts**: ${zodiac.strengths.slice(0, 3).join(', ')}.\n- **Growth Edge**: Practicing patience and avoiding ${zodiac.challenges[0].toLowerCase()}.\n\n💡 **Ask Me Anything**: Feel free to ask about your career outlook, love compatibility, or 2026 transits!`;
      }
    }

    setMessages((prev) => [...prev, { sender: 'guru', text: reply }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-xs transition-opacity" />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-[#172554]">AstroGuru AI</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-[#64748B]">
                {hasTimeAndPlace ? 'Detailed Birth Chart Matrix' : 'Quick DOB-Based Assistant'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setMessages([
                  {
                    sender: 'guru',
                    text: `Namaste ${profile.name}! Conversation cleared. What can I illuminate for you today?`
                  }
                ]);
              }}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-rose-600 transition-all text-xs"
              title="Reset Conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tone Selector */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[10px] font-bold uppercase text-[#64748B]">Tone:</span>
          <div className="flex gap-1">
            {[
              { id: 'friendly', label: '🌿 Friendly' },
              { id: 'mystic', label: '🔮 Mystic' },
              { id: 'modern', label: '🔬 Modern' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setPersonality(t.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  personality === t.id
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8FAFC]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#4F46E5] text-white rounded-br-xs'
                    : 'bg-white border border-[#E2E8F0] text-[#172554] rounded-bl-xs'
                }`}
              >
                {m.sender === 'guru' && (
                  <span className="text-[10px] font-bold uppercase text-[#4F46E5] block mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    AstroGuru
                  </span>
                )}
                <MarkdownRenderer content={m.text} isUser={m.sender === 'user'} />
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-[#64748B] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                <span>Consulting cosmic transits for {profile.name}...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px]">
          {[
            'What does my career outlook say?',
            'Tell me about my relationship tendencies.',
            'What should I focus on this month?'
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-medium hover:bg-slate-100 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your career, love, 2026 transits..."
            className="flex-1 px-4 py-3 rounded-xl border border-[#CBD5E1] text-xs text-[#172554] focus:outline-none focus:border-[#4F46E5] bg-white"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isTyping}
            className="w-11 h-11 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
