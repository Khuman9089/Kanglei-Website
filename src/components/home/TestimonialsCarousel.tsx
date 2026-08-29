'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const DEFAULT_TESTIMONIALS = [
  {
    id: 'rev-1',
    comment: "The accuracy of the predictions was remarkable. The career guidance helped me make a crucial decision.",
    clientName: "Priya S.",
    location: "Mumbai",
    rating: 5,
  },
  {
    id: 'rev-2',
    comment: "I was skeptical at first, but the detailed birth chart analysis changed my perspective completely.",
    clientName: "Rahul M.",
    location: "Delhi",
    rating: 5,
  },
  {
    id: 'rev-3',
    comment: "The marriage compatibility report was incredibly detailed and accurate. Highly recommended!",
    clientName: "Ananya K.",
    location: "Bangalore",
    rating: 5,
  },
  {
    id: 'rev-4',
    comment: "Best astrology consultation I've ever had. The remedies suggested actually worked!",
    clientName: "Vikram P.",
    location: "Hyderabad",
    rating: 5,
  },
  {
    id: 'rev-5',
    comment: "The Vimshottari Dasha analysis was spot-on. Every prediction matched my life events.",
    clientName: "Meera R.",
    location: "Chennai",
    rating: 5,
  }
];

export default function TestimonialsCarousel() {
  const [reviewsList, setReviewsList] = useState(DEFAULT_TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/reviews?approvedOnly=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviewsList(data.reviews);
        }
      })
      .catch((err) => console.error('Error fetching approved reviews:', err));
  }, []);

  useEffect(() => {
    if (reviewsList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviewsList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviewsList.length]);

  // Show 3 items on desktop, 1 on mobile
  const getVisibleItems = () => {
    if (reviewsList.length === 0) return [];
    const items = [];
    for (let i = 0; i < Math.min(3, reviewsList.length); i++) {
      items.push(reviewsList[(currentIndex + i) % reviewsList.length]);
    }
    return items;
  };

  return (
    <section className="py-16 md:py-20 bg-[#fffdfa] text-[#0f172a] border-t border-[#f3e8d2] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#0f172a] mb-3">
            What Our <span className="text-[#b45309]">Clients Say</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d97706] to-transparent"></div>
        </div>

        {/* Mobile View (1 item) */}
        {reviewsList.length > 0 && (
          <div className="block md:hidden relative h-64">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-white p-7 rounded-3xl border border-[#f3e8d2] shadow-[0_4px_20px_rgba(217,119,6,0.06)] flex flex-col justify-between"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(reviewsList[currentIndex]?.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4 leading-relaxed font-medium">"{reviewsList[currentIndex]?.comment}"</p>
                <div>
                  <p className="font-serif font-bold text-lg text-[#0f172a]">{reviewsList[currentIndex]?.clientName}</p>
                  <p className="text-xs text-[#b45309] font-semibold">{reviewsList[currentIndex]?.location}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Desktop View (3 items) */}
        <div className="hidden md:flex gap-6 justify-center">
          <AnimatePresence mode="popLayout">
            {getVisibleItems().map((item) => (
              <motion.div
                key={`${item.id}-${currentIndex}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex-1 bg-white p-8 rounded-3xl border border-[#f3e8d2] shadow-[0_4px_25px_rgba(217,119,6,0.05)] hover:border-[#d97706] hover:shadow-[0_10px_30px_rgba(217,119,6,0.1)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6 leading-relaxed font-medium">"{item.comment}"</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-xl text-[#0f172a]">{item.clientName}</p>
                  <p className="text-xs text-[#b45309] font-semibold">{item.location}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2.5 mt-10">
          {reviewsList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentIndex === idx ? 'w-8 bg-[#d97706]' : 'w-2.5 bg-[#fde68a]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
