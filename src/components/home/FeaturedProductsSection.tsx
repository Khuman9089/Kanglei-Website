'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Star, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { ProductItem } from '@/app/api/shop/route';

export default function FeaturedProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    fetch('/api/shop')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          // Show products marked isFeatured OR fallback to top 3 approved items
          const approved = data.products.filter((p: any) => !p.status || p.status === 'APPROVED');
          const featured = approved.filter((p: any) => p.isFeatured);
          setFeaturedProducts(featured.length > 0 ? featured : approved.slice(0, 3));
        }
      })
      .catch((err) => console.error('Error loading featured products:', err));
  }, []);

  if (featuredProducts.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-[#0b132b] via-[#1c2541] to-[#0b132b] border-t border-[#3a506b]/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#c69214]/20 border border-[#c69214]/30 text-[#f4d58d] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#c69214]" />
              <span>Sacred E-Store & Consecrated Remedies</span>
            </div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#faf8f4]">
              Handpicked Authentic <span className="text-[#c69214]">Vedic Products</span>
            </h2>
            <p className="text-gray-300 text-sm max-w-2xl leading-relaxed">
              Energized Sri Yantras, unheated Ceylon gemstones, sacred rudrakshas, and remedies consecrated by master pandits.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#c69214] to-[#e0a96d] text-[#0b132b] font-extrabold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer shrink-0"
          >
            <span>Browse Full E-Store</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              className="bg-[#1c2541]/80 backdrop-blur-md rounded-3xl border border-[#3a506b] overflow-hidden hover:border-[#c69214]/60 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Badges */}
                <div className="relative h-60 w-full overflow-hidden bg-[#0b132b]">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#0b132b]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#c69214]/40 text-[#f4d58d] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <ShieldCheck className="w-3 h-3 text-[#c69214]" />
                    <span>{prod.badge || 'Consecrated Remedy'}</span>
                  </div>

                  {prod.sellerName && (
                    <div className="absolute bottom-3 right-3 bg-[#0b132b]/80 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold">
                      Seller: {prod.sellerName}
                    </div>
                  )}
                </div>

                {/* Info Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#e0a96d] uppercase tracking-wider font-mono">
                      {prod.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{prod.rating || 5.0}</span>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-white line-clamp-2 leading-snug group-hover:text-[#f4d58d] transition-colors">
                    {prod.title}
                  </h3>

                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
              </div>

              {/* Price Footer & Buy CTA */}
              <div className="p-6 pt-0 border-t border-[#3a506b]/40 mt-4 flex items-center justify-between">
                <div>
                  <div className="font-mono font-extrabold text-2xl text-[#f4d58d]">
                    ₹{prod.price.toLocaleString()}
                  </div>
                  {prod.originalPrice > prod.price && (
                    <span className="text-xs text-gray-400 line-through font-mono">
                      ₹{prod.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <Link
                  href={`/shop/${prod.id}`}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c69214] to-[#e0a96d] text-[#0b132b] font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Now</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
