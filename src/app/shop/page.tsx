'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Star, Search, Filter, Sparkles, CheckCircle2, ArrowUpDown
} from 'lucide-react';
import { ProductItem } from '@/app/api/shop/route';
import ShopHeroSlider from '@/components/shop/ShopHeroSlider';

export default function ShopPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [sliders, setSliders] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('FEATURED');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/shop')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
        if (data.sliders && Array.isArray(data.sliders)) {
          setSliders(data.sliders);
        }
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(['All', ...data.categories]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading shop catalog:', err);
        setLoading(false);
      });
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

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory || p.category.startsWith(selectedCategory);

      let matchesPrice = true;
      if (priceFilter === 'UNDER_1000') matchesPrice = p.price < 1000;
      else if (priceFilter === '1000_5000') matchesPrice = p.price >= 1000 && p.price <= 5000;
      else if (priceFilter === 'ABOVE_5000') matchesPrice = p.price > 5000;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return a.price - b.price;
      if (sortBy === 'PRICE_HIGH') return b.price - a.price;
      if (sortBy === 'RATING') return (b.rating || 0) - (a.rating || 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#0f172a] flex flex-col font-sans antialiased">
      <main className="flex-1 pt-20 sm:pt-24 md:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* 1. ANIMATED PRODUCT HERO SLIDER */}
        <ShopHeroSlider sliders={sliders} />

        {/* 2. SEARCH, CATEGORIES & FILTERS BAR */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search gemstones, yantras, books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-[#fcfbfa] text-xs font-medium text-[#0f172a] focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 font-bold shrink-0">
                <Filter className="w-4 h-4 text-amber-600" />
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-[#fcfbfa] text-xs font-bold text-[#0f172a] focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Price Ranges</option>
                  <option value="UNDER_1000">Under ₹1,000</option>
                  <option value="1000_5000">₹1,000 - ₹5,000</option>
                  <option value="ABOVE_5000">Above ₹5,000</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-600 font-bold shrink-0">
                <ArrowUpDown className="w-4 h-4 text-amber-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-[#fcfbfa] text-xs font-bold text-[#0f172a] focus:border-amber-500 focus:outline-none cursor-pointer"
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
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white text-gray-700 hover:text-black border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3. PRODUCT CATALOG GRID (REFERENCE IMAGE THEME) */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 space-y-3">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto opacity-40" />
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
              className="px-5 py-2 rounded-xl bg-black text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-6">
            {filteredProducts.map((product) => {
              const discountAmount = product.originalPrice > product.price
                ? product.originalPrice - product.price
                : 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group relative"
                >
                  {/* HANGING GOLD RIBBON BADGE (REFERENCE IMAGE MATCH) */}
                  <div 
                    className="absolute top-0 left-4 z-20 bg-gradient-to-b from-[#f59e0b] via-[#eab308] to-[#d97706] text-black font-extrabold text-[10px] px-2 pt-1.5 pb-2.5 shadow-md flex flex-col items-center justify-center leading-tight tracking-tight uppercase"
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%)',
                      minWidth: '46px',
                    }}
                  >
                    {discountAmount > 0 ? (
                      <>
                        <span className="text-[11px] font-black leading-none">₹{discountAmount}</span>
                        <span className="text-[8px] font-extrabold opacity-90 leading-none mt-0.5">OFF</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[9px] font-black leading-none">VEDIC</span>
                        <span className="text-[8px] font-extrabold opacity-90 leading-none mt-0.5">SIDDH</span>
                      </>
                    )}
                  </div>

                  {/* PRODUCT IMAGE CONTAINER */}
                  <Link href={`/shop/${product.id}`} className="block relative aspect-square bg-[#f7f4ee]/60 overflow-hidden group/img">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                    />

                    {/* FLOATING RATING BADGE (BOTTOM-RIGHT OF IMAGE) */}
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-white/95 text-[#0f172a] text-[11px] font-extrabold shadow-sm border border-gray-200/80 flex items-center gap-1 backdrop-blur-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating ? product.rating.toFixed(2) : '4.85'}</span>
                    </div>
                  </Link>

                  {/* CENTERED PRODUCT CONTENT (MATCHING REFERENCE IMAGE) */}
                  <div className="p-4 pt-3 flex-1 flex flex-col justify-between text-center space-y-2">
                    
                    <div className="space-y-1.5">
                      <Link href={`/shop/${product.id}`} className="block group/title">
                        <h3 className="font-serif text-sm font-bold text-gray-900 line-clamp-2 leading-tight group-hover/title:text-[#b45309] transition-colors min-h-[38px]">
                          {product.title}
                        </h3>
                      </Link>

                      {/* CENTERED PRICE SECTION */}
                      <div className="flex items-center justify-center gap-2 pt-0.5">
                        <span className="text-sm font-black text-gray-900 font-mono">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through font-mono">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* FULL-WIDTH BLACK ADD TO CART BUTTON (REFERENCE IMAGE MATCH) */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-2.5 rounded-lg bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm mt-2 active:scale-98"
                    >
                      ADD TO CART
                    </button>

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
