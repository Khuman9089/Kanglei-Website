'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Star, Sparkles, ArrowRight, CheckCircle2, 
  ShieldCheck, Filter, ChevronDown, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';
import Link from 'next/link';
import ShopHeroSlider from '@/components/shop/ShopHeroSlider';
import { ProductItem, ShopSliderItem } from '@/app/api/shop/route';

export default function ShopPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [sliders, setSliders] = useState<ShopSliderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>(['All', 'Gemstones', 'Astrology Books', 'Yantras & Mala', 'Puja Items', 'Consecrated Remedies']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<string>('ALL'); // 'ALL' | 'UNDER_1000' | '1000_5000' | 'ABOVE_5000'
  const [sortBy, setSortBy] = useState<string>('FEATURED'); // 'FEATURED' | 'PRICE_LOW' | 'PRICE_HIGH' | 'RATING'

  useEffect(() => {
    fetch('/api/shop')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products.filter((p: any) => !p.status || p.status === 'APPROVED'));
        }
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(['All', ...data.categories]);
        }
        if (data.sliders && Array.isArray(data.sliders)) {
          setSliders(data.sliders);
        }
      })
      .catch((err) => console.error('Error loading products & sliders:', err));
  }, []);

  const handleAddToCart = (product: ProductItem) => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kanglei_cart');
      let cartItems: any[] = [];
      if (stored) {
        try {
          cartItems = JSON.parse(stored);
        } catch (e) {
          cartItems = [];
        }
      }

      const existingIndex = cartItems.findIndex((it) => it.id === product.id);
      if (existingIndex >= 0) {
        cartItems[existingIndex].quantity += 1;
      } else {
        cartItems.push({
          id: product.id,
          productId: product.id,
          title: product.title,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          quantity: 1,
        });
      }

      localStorage.setItem('kanglei_cart', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('cart-updated'));
      window.dispatchEvent(new Event('open-cart-drawer'));
    }
  };

  // Filter & Sort Products
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      
      let matchesPrice = true;
      if (priceFilter === 'UNDER_1000') matchesPrice = p.price < 1000;
      else if (priceFilter === '1000_5000') matchesPrice = p.price >= 1000 && p.price <= 5000;
      else if (priceFilter === 'ABOVE_5000') matchesPrice = p.price > 5000;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return a.price - b.price;
      if (sortBy === 'PRICE_HIGH') return b.price - a.price;
      if (sortBy === 'RATING') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex flex-col font-sans antialiased">
      <main className="flex-1 pt-20 sm:pt-24 md:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* 1. ANIMATED PRODUCT HERO SLIDER */}
        <ShopHeroSlider sliders={sliders} />

        {/* 2. SEARCH, CATEGORIES & FILTERS BAR */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#f3e8d2] shadow-xs">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#b45309] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search gemstones, scriptures, Yantras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-medium text-[#0f172a] placeholder-gray-400 focus:border-[#d97706] focus:outline-none"
              />
            </div>

            {/* Price Filter & Sort Dropdowns */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 font-bold shrink-0">
                <Filter className="w-4 h-4 text-[#d97706]" />
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-bold text-[#0f172a] focus:border-[#d97706] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Prices</option>
                  <option value="UNDER_1000">Under ₹1,000</option>
                  <option value="1000_5000">₹1,000 – ₹5,000</option>
                  <option value="ABOVE_5000">Above ₹5,000</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-600 font-bold shrink-0">
                <ArrowUpDown className="w-4 h-4 text-[#d97706]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-bold text-[#0f172a] focus:border-[#d97706] focus:outline-none cursor-pointer"
                >
                  <option value="FEATURED">Featured Items</option>
                  <option value="PRICE_LOW">Price: Low to High</option>
                  <option value="PRICE_HIGH">Price: High to Low</option>
                  <option value="RATING">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:text-[#b45309] border border-[#f3e8d2] hover:border-[#d97706]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3. PRODUCT CATALOG GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#f3e8d2] space-y-3">
            <ShoppingBag className="w-12 h-12 text-[#d97706] mx-auto opacity-40" />
            <h3 className="font-serif font-bold text-xl text-[#0f172a]">No Products Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try adjusting your search keywords or switching product category filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setPriceFilter('ALL');
              }}
              className="px-5 py-2 rounded-xl bg-[#d97706] text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const discountPct = product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-[#f3e8d2] shadow-md hover:shadow-xl hover:border-[#d97706] transition-all hover:-translate-y-1 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Image Container with Badge Overlay */}
                  <div className="h-60 bg-slate-100 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0f172a]/90 text-[#fbbf24] text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs border border-[#fbbf24]/40">
                        {product.badge || 'AUTHENTIC'}
                      </span>

                      {discountPct > 0 && (
                        <span className="px-2.5 py-1 rounded-lg bg-green-600 text-white font-black text-[10px] shadow-sm">
                          {discountPct}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Metadata */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-1 font-bold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{product.rating}</span>
                          <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                        </span>
                      </div>

                      <Link href={`/shop/${product.id}`} className="block group">
                        <h3 className="font-serif font-bold text-lg text-[#0f172a] leading-snug group-hover:text-[#d97706] transition-colors line-clamp-2">
                          {product.title}
                        </h3>
                      </Link>

                      <p className="text-gray-600 text-xs mt-2 line-clamp-2 leading-relaxed font-sans">
                        {product.description}
                      </p>

                      {/* Features */}
                      {product.features && product.features.length > 0 && (
                        <ul className="space-y-1 pt-3 mt-3 border-t border-gray-100 text-[11px] text-gray-600">
                          {product.features.slice(0, 2).map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#d97706] shrink-0" />
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Price & Action Buttons */}
                    <div className="pt-4 border-t border-[#fde68a]/60 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-2xl font-black text-[#b45309] font-mono">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through block font-mono">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/shop/${product.id}`}
                          className="px-3 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:text-[#d97706] font-extrabold text-xs transition-colors"
                        >
                          Details
                        </Link>
                        
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
