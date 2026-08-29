'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';

const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', rashi: 'Mesha', element: 'Fire', dates: 'Mar 21 - Apr 19' },
  { name: 'Taurus', symbol: '♉', rashi: 'Vrishabha', element: 'Earth', dates: 'Apr 20 - May 20' },
  { name: 'Gemini', symbol: '♊', rashi: 'Mithuna', element: 'Air', dates: 'May 21 - Jun 20' },
  { name: 'Cancer', symbol: '♋', rashi: 'Karka', element: 'Water', dates: 'Jun 21 - Jul 22' },
  { name: 'Leo', symbol: '♌', rashi: 'Simha', element: 'Fire', dates: 'Jul 23 - Aug 22' },
  { name: 'Virgo', symbol: '♍', rashi: 'Kanya', element: 'Earth', dates: 'Aug 23 - Sep 22' },
  { name: 'Libra', symbol: '♎', rashi: 'Tula', element: 'Air', dates: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', symbol: '♏', rashi: 'Vrishchika', element: 'Water', dates: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', symbol: '♐', rashi: 'Dhanu', element: 'Fire', dates: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', symbol: '♑', rashi: 'Makara', element: 'Earth', dates: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', symbol: '♒', rashi: 'Kumbha', element: 'Air', dates: 'Jan 20 - Feb 18' },
  { name: 'Pisces', symbol: '♓', rashi: 'Meena', element: 'Water', dates: 'Feb 19 - Mar 20' },
];

export default function ZodiacGrid() {
  return (
    <section className="py-16 md:py-20 bg-[#fffdfa] text-[#0f172a] relative overflow-hidden border-t border-[#f3e8d2]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-100/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-4 h-4 text-[#d97706]" />
            Transit Predictions for Career, Love, and Wealth
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#0f172a]">
            Your Moon Sign Forecasts: <span className="text-[#b45309]">Insightful Guides for Life's Journey</span>
          </h2>
          <p className="text-gray-600 text-base mt-3 max-w-xl mx-auto font-medium">
            Select your Vedic Moon Sign (Rashi) to read personalized transit predictions updated daily by our astrologer.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {ZODIAC_SIGNS.map((sign, idx) => (
            <motion.div
              key={sign.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04 }}
            >
              <Link
                href={`/horoscope/${sign.name.toLowerCase()}`}
                className="group block p-6 rounded-2xl bg-white border border-[#f3e8d2] text-center hover:border-[#d97706] transition-all hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(217,119,6,0.04)] hover:shadow-[0_10px_25px_rgba(217,119,6,0.12)] relative overflow-hidden"
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d97706] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <span className="text-4xl text-[#d97706] group-hover:scale-110 transition-transform block mb-2 font-serif">
                  {sign.symbol}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#0f172a] group-hover:text-[#b45309] transition-colors">
                  {sign.name}
                </h3>
                <span className="text-xs text-gray-500 block font-mono">({sign.rashi})</span>

                <div className="mt-4 pt-3 border-t border-[#f3e8d2] flex items-center justify-center gap-1 text-xs font-bold text-[#b45309] group-hover:text-[#d97706]">
                  <span>Read Forecast</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
