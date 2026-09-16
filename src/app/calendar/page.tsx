import React from 'react';
import type { Metadata } from 'next';
import MonthlyCalendarView from '@/components/calendar/MonthlyCalendarView';

export const metadata: Metadata = {
  title: 'Manipuri Monthly Calendar (থাগী ক্যালেন্ডার) | KangleiAstro',
  description: 'Authentic Manipuri Monthly Astrological Calendar replicating traditional Kanglei and Vedic calculations — Lunar Thabanik, Soura Saka Date, Tithi Ending Times, Ee Khudeng Leiba / Leitaba, and Tatnaba Numit.',
  keywords: [
    'Manipuri Calendar',
    'Kanglei Calendar',
    'Thagi Calendar',
    'Manipuri Panchang',
    'Thabanik',
    'Saka Year',
    'Ee Khudeng Leiba',
    'Tatnaba Numit'
  ],
};

export default function CalendarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-slate-900 selection:bg-amber-200 selection:text-amber-950 font-sans">
      <main className="flex-1 py-6 md:py-10">
        <MonthlyCalendarView />
      </main>
    </div>
  );
}
