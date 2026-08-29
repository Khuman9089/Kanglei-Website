'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProductItem {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge: string;
  stock: number;
  description: string;
  features: string[];
}

export default function FeaturedShopSection() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    fetch('/api/shop')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          const approved = data.products.filter((p: any) => !p.status || p.status === 'APPROVED');
          const featured = approved.filter((p: any) => p.isFeatured);
          setFeaturedProducts(featured.length > 0 ? featured : approved.slice(0, 4));
        }
      })
      .catch((err) => console.error('Error loading featured shop products:', err));
  }, []);

  return (
    <section className="py-16 md:py-20 bg-[#fffdfa] text-[#0f172a] border-t border-[#f3e8d2]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-[#d97706]" />
              100% Certified Vedic Remedies & Authentic Literature
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#0f172a]">
              Authentic Vedic <span className="text-[#b45309]">E-Store Products</span>
            </h2>
            <p className="text-gray-600 text-base mt-2.5 max-w-xl">
              Shop lab-certified natural gemstones, consecrated 3D Shree Yantras, original Nepali Rudrakshas, and hardcover Vedic classics.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs tracking-wide shadow-md hover:shadow-lg hover:opacity-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Full E-Store</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, idx) => {
            const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-3xl border border-[#f3e8d2] shadow-[0_4px_20px_rgba(217,119,6,0.04)] hover:border-[#d97706] hover:shadow-[0_10px_30px_rgba(217,119,6,0.12)] transition-all hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image Header with Badges */}
                <div className="h-52 bg-cover bg-center relative" style={{ backgroundImage: `url(${product.image})` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-[#0f172a]/90 backdrop-blur-xs text-[#fbbf24] text-[9px] font-extrabold uppercase tracking-wider">
                      {product.badge}
                    </span>

                    {discountPct > 0 && (
                      <span className="px-2 py-0.5 rounded bg-green-600 text-white font-extrabold text-[10px]">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-amber-500 mb-1">
                      <div className="flex items-center gap-1 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-extrabold">In Stock</span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#0f172a] mb-1.5 group-hover:text-[#b45309] transition-colors leading-snug line-clamp-2">
                      {product.title}
                    </h3>

                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    <div className="space-y-1 pt-2 border-t border-[#f3e8d2] mb-3">
                      {product.features.slice(0, 2).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-gray-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-[#f3e8d2] flex items-center justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-[#b45309] font-mono">₹{product.price.toLocaleString()}</span>
                      <span className="text-[11px] text-gray-400 line-through block font-mono">₹{product.originalPrice.toLocaleString()}</span>
                    </div>

                    <Link
                      href="/shop"
                      className="py-2 px-4 rounded-xl bg-[#0f172a] text-[#fbbf24] font-bold text-xs hover:bg-[#1e293b] transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <span>Buy Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-10 p-5 rounded-2xl bg-[#faf8f4] border border-[#f3e8d2] flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <strong className="font-bold text-[#0f172a] block text-sm">Lab Certified Authenticity & Consecration</strong>
              <span>Every gemstone comes with a government lab testing certificate and pre-dispatch puja.</span>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-[#b45309] font-extrabold hover:text-[#d97706] flex items-center gap-1 uppercase tracking-wider text-[11px]"
          >
            <span>Browse All Product Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
