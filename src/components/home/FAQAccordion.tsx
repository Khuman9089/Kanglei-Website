'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What is Vedic Astrology?",
    answer: "Vedic Astrology, or Jyotish, is the traditional Hindu system of astrology. It translates to 'the science of light' and is based on ancient Indian scriptures. It focuses on the karmic patterns and spiritual journey of an individual, offering deep insights into one's life purpose, strengths, and challenges."
  },
  {
    question: "How is Vedic astrology different from Western astrology?",
    answer: "Vedic astrology uses the sidereal zodiac, which accounts for the precession of the equinoxes and aligns with the actual observable constellations. Western astrology uses the tropical zodiac, which is fixed to the seasons. Additionally, Vedic astrology places more emphasis on the Moon sign and uses unique predictive tools like the Dasha system."
  },
  {
    question: "Why do you need exact birth time?",
    answer: "An exact birth time is crucial for calculating your Ascendant (Lagna) and the exact degrees of the planets in the houses. Even a difference of a few minutes can shift the entire chart, altering predictions and the timing of events in your Dasha sequence."
  },
  {
    question: "What is a Kundli/Birth Chart?",
    answer: "A Kundli is a snapshot of the sky at the exact moment and location of your birth. It maps the positions of the 9 planets (Navagraha) across 12 zodiac signs and 12 houses, revealing your astrological blueprint for this lifetime."
  },
  {
    question: "How does the consultation work?",
    answer: "Once you book a slot, you'll be asked to provide your birth details (date, time, location). The astrologer will analyze your chart prior to the session. During the live video or audio call, we will discuss your chart, address your specific questions, and provide actionable guidance and remedies."
  },
  {
    question: "What is Vimshottari Dasha?",
    answer: "Vimshottari Dasha is a 120-year cycle of planetary periods used in Vedic astrology to predict the timing of events in a person's life. Each period is ruled by a specific planet, and its effects depend on that planet's placement and strength in your birth chart."
  },
  {
    question: "How accurate is the free Kundli generator?",
    answer: "Our free Kundli generator uses the highly precise Swiss Ephemeris to calculate planetary positions, ensuring the highest level of astronomical accuracy available for charting."
  },
  {
    question: "Is my personal information safe?",
    answer: "Yes, absolute privacy is guaranteed. Your birth details, consultation recordings, and reports are strictly confidential and never shared with third parties under any circumstances."
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-20 bg-[#faf8f4] text-[#0f172a] border-t border-[#f3e8d2]">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-10">
          <span className="px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
            <HelpCircle className="w-4 h-4 text-[#d97706]" />
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0f172a] mb-3">
            Frequently Asked <span className="text-[#b45309]">Questions</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d97706] to-transparent mx-auto"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? 'bg-white shadow-[0_6px_25px_rgba(217,119,6,0.08)] border-[#d97706]' 
                    : 'bg-white/80 border-[#f3e8d2] hover:bg-white hover:border-[#d97706]/40'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <span className={`font-serif text-lg md:text-xl font-bold transition-colors ${isOpen ? 'text-[#b45309]' : 'text-[#0f172a]'}`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-4 w-8 h-8 rounded-full bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-[#f3e8d2] pt-4 font-medium text-sm md:text-base">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
