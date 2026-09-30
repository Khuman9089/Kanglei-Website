'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  User,
  Bot,
  RefreshCw,
  Sliders,
  ChevronDown,
  Volume2,
  Check,
  Flame,
  ArrowRight
} from 'lucide-react';
import { BirthProfile } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MobileAIGuruChatProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BirthProfile;
  zodiac: { name: string; element: string; rulingPlanet: string };
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'guru';
  text: string;
  timestamp: string;
}

const DEFAULT_QUESTIONS = [
  'What does 2026 hold for my career?',
  'Explain my Sun & Rising sign combination.',
  'What are my key love & relationship periods?',
  'What is my lucky gemstone and favorable day?',
];

export function MobileAIGuruChat({
  isOpen,
  onClose,
  profile,
  zodiac,
}: MobileAIGuruChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'guru',
      text: `Namaste, **${profile.name}**! ✨\n\nI am your **AstroGuru AI**, attuned to your **${zodiac.name}** (${zodiac.element} element, ruled by ${zodiac.rulingPlanet}). How may the stars illuminate your path today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tone, setTone] = useState<'friendly' | 'mystic' | 'modern'>('friendly');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Connect to live AI Oracle backend
      const res = await fetch('/api/jyoti/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          profile: {
            name: profile.name,
            dob: profile.dateOfBirth,
            tob: profile.timeOfBirth,
            pob: profile.birthPlace,
            sign: zodiac.name,
          },
          tone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const guruMsg: ChatMessage = {
          id: `msg_g_${Date.now()}`,
          sender: 'guru',
          text: data.answer || data.response || generateOfflineResponse(textToSend),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, guruMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Fallback to rich astrological guidance
      setTimeout(() => {
        const fallbackText = generateOfflineResponse(textToSend);
        const guruMsg: ChatMessage = {
          id: `msg_g_${Date.now()}`,
          sender: 'guru',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, guruMsg]);
      }, 700);
    } finally {
      setIsTyping(false);
    }
  };

  const generateOfflineResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('career') || q.includes('job') || q.includes('2026') || q.includes('promotion')) {
      return `### 🌟 Career Outlook for ${profile.name} (${zodiac.name})\n\nUnder your **${zodiac.name}** placement, the transits of **Jupiter** and **Saturn** in 2026 favor **strategic leadership, high autonomy, and consolidation**.\n\n* **Favorable Quarter**: Q2 & Q3 2026 bring expansion and public recognition.\n* **Key Strengths**: Initiative, decisive communication, and mentoring others.\n* **Cosmic Advice**: Avoid rushed lateral moves in Q1. Build deep authority in your current niche before expanding.`;
    }
    if (q.includes('love') || q.includes('relationship') || q.includes('partner') || q.includes('soulmate')) {
      return `### ❤️ Love & Relationships for ${zodiac.name}\n\nYour emotional archetype seeks **authenticity, deep loyalty, and mutual respect**.\n\n* **Harmonious Elements**: ${zodiac.element === 'Fire' ? 'Air and fellow Fire signs' : 'Water and Earth signs'} provide effortless synergy.\n* **Relationship Transit**: The upcoming Venus transit encourages vulnerability and shared travel.\n* **Guidance**: Communicate your boundaries gently without self-protecting through emotional withdrawal.`;
    }
    return `### ✨ Cosmic Guidance for ${profile.name}\n\nYour birth vibration as a **${zodiac.name}** is illuminated by **${zodiac.rulingPlanet}**.\n\n* **Today's Mantra**: *"I align with my highest purpose and welcome abundant opportunities with grace."*\n* **Auspicious Direction**: East\n* **Takeaway**: Trust your intuition when making key decisions this week. The cosmic transits strongly support steady compounding progress.`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090D2A]/85 backdrop-blur-md flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      
      {/* Mobile Chat Sheet Container */}
      <div className="w-full sm:max-w-md h-[90vh] sm:h-[650px] bg-[#F8FAFF] rounded-t-[36px] sm:rounded-[36px] shadow-2xl flex flex-col overflow-hidden border border-indigo-200 relative select-none">
        
        {/* Chat Top Header */}
        <div className="bg-gradient-to-r from-[#111827] via-[#1E1B4B] to-[#2D1B4E] text-white p-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#667EEA] to-[#764BA2] p-[1.5px] shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-2xl bg-[#0E152E] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0E152E] absolute -bottom-0.5 -right-0.5" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-white font-serif">AstroGuru AI</h3>
                <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[9px] font-bold">
                  24/7 ORACLE
                </span>
              </div>
              <p className="text-[10px] text-indigo-200">
                Reading for {profile.name} • {zodiac.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tone Selector */}
            <div className="flex bg-white/10 rounded-xl p-0.5 text-[9px] font-bold">
              {(['friendly', 'mystic', 'modern'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-2 py-1 rounded-lg capitalize transition-all ${
                    tone === t ? 'bg-[#667EEA] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#667EEA] to-[#764BA2] text-white flex items-center justify-center shrink-0 text-xs shadow-xs mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                  }`}
                >
                  {isUser ? (
                    <p className="font-semibold">{m.text}</p>
                  ) : (
                    <MarkdownRenderer content={m.text} />
                  )}
                  <span
                    className={`text-[9px] block text-right mt-1.5 ${
                      isUser ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 bg-white p-2.5 rounded-2xl border border-slate-200 w-fit shadow-2xs animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span className="font-bold">Consulting planetary transits...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/80 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 shrink-0">
            Ask:
          </span>
          {DEFAULT_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-indigo-400 text-[10px] font-bold text-slate-700 hover:text-indigo-600 whitespace-nowrap shadow-2xs transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={`Ask AstroGuru about your ${zodiac.name} chart...`}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-inner"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white flex items-center justify-center shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
