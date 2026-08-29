'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Star, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, 
  Plus, Minus, X, CreditCard, QrCode, Truck, Tag, BookOpen, Gem, Check
} from 'lucide-react';
import Link from 'next/link';

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

interface CartItem {
  product: ProductItem;
  quantity: number;
}

export default function ShopPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>(['All', 'Gemstones', 'Astrology Books', 'Yantras & Mala', 'Puja Items']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Shopping Cart & Checkout State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Form Fields
  const [buyerName, setBuyerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [utr, setUtr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      })
      .catch((err) => console.error('Error loading products:', err));
  }, []);

  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalCartAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handlePlaceShopOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !mobile || !address || !pincode || !utr) return;

    setIsSubmitting(true);

    const orderPayload = {
      action: 'PLACE_ORDER',
      buyerName,
      mobile,
      whatsappNo: whatsappNo || mobile,
      address,
      pincode,
      items: cart.map((c) => ({
        productId: c.product.id,
        title: c.product.title,
        price: c.product.price,
        quantity: c.quantity,
      })),
      totalAmount: totalCartAmount,
      utr,
    };

    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (data.success) {
        setOrderConfirmed(true);
        setCart([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#faf8f4] flex flex-col font-sans antialiased">
      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        
        {/* 1. HERO HEADER */}
        <div className="text-center pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7]/10 border border-[#fbbf24]/30 text-[#fbbf24] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-[#fbbf24]" />
            100% Certified Vedic Remedies & Authentic Literature
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight">
            KangleiAstro <span className="text-[#fbbf24]">Vedic E-Store</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base mt-3 max-w-2xl mx-auto">
            Shop lab-certified gemstones, authentic Vedic hardcover books, energized 3D Shree Yantras, and Nepali Rudraksha beads.
          </p>

          {/* Cart Floating Indicator */}
          <div className="mt-6 flex items-center justify-center">
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-lg hover:opacity-95 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Shopping Cart ({cart.reduce((s, c) => s + c.quantity, 0)})</span>
              {totalCartAmount > 0 && <span className="font-mono bg-[#0b132b] px-2 py-0.5 rounded-md text-[#fbbf24] text-[11px]">₹{totalCartAmount}</span>}
            </button>
          </div>
        </div>

        {/* 2. SEARCH & CATEGORY TABS */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search gemstones, Parashara Hora, Yantras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-[#3a506b] bg-[#1c2541] text-xs font-medium text-white placeholder-gray-400 focus:border-[#d97706] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                    : 'bg-[#1c2541] text-gray-300 hover:text-white border border-[#3a506b]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3. PRODUCT CATALOG GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

            return (
              <div
                key={product.id}
                className="bg-[#1c2541] rounded-3xl border border-[#3a506b]/50 shadow-md hover:border-[#d97706] transition-all hover:-translate-y-1 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image Header with Badge Overlay */}
                <div className="h-56 bg-cover bg-center relative" style={{ backgroundImage: `url(${product.image})` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c2541] via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#0b132b]/90 backdrop-blur-xs text-[#fbbf24] text-[10px] font-extrabold uppercase border border-[#3a506b]">
                      {product.badge}
                    </span>

                    {discountPct > 0 && (
                      <span className="px-2.5 py-1 rounded-full bg-green-600 text-white font-extrabold text-[10px]">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
                      <div className="flex items-center gap-1 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-gray-400 font-normal">({product.reviewsCount} reviews)</span>
                      </div>
                      <span className="text-[10px] text-green-400 font-bold">{product.stock} in stock</span>
                    </div>

                    <h3 className="font-serif font-bold text-xl text-white mb-2 leading-snug group-hover:text-[#fbbf24] transition-colors">
                      {product.title}
                    </h3>
                    
                    <p className="text-slate-300 text-xs leading-relaxed line-clamp-2 mb-4">
                      {product.description}
                    </p>

                    {/* Features list */}
                    <ul className="space-y-1.5 pt-3 border-t border-[#3a506b]/40 mb-4">
                      {product.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-4 border-t border-[#3a506b]/40 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-[#fbbf24] font-mono">₹{product.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 line-through block font-mono">₹{product.originalPrice.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 transition-opacity flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* ─────────────────────────────────────────────────────────────
         4. SHOPPING CART & UPI CHECKOUT MODAL DRAWER
         ───────────────────────────────────────────────────────────── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-[#0b132b]/80 backdrop-blur-xs flex justify-end">
          <div className="bg-[#1c2541] w-full max-w-md h-full flex flex-col justify-between border-l border-[#3a506b] shadow-2xl text-white font-sans p-6 overflow-y-auto">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#3a506b]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#fbbf24]" />
                  <h3 className="font-serif font-bold text-xl text-white">Your Shopping Cart</h3>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutStep(false);
                    setOrderConfirmed(false);
                  }}
                  className="p-1.5 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* STEP 1: CART ITEMS VIEW */}
              {!isCheckoutStep && !orderConfirmed && (
                <div className="py-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 space-y-3">
                      <ShoppingBag className="w-12 h-12 mx-auto text-gray-500" />
                      <p className="text-sm font-bold">Your cart is currently empty</p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="px-4 py-2 rounded-xl bg-[#d97706] text-white text-xs font-bold"
                      >
                        Browse Astrology Shop
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.product.id} className="p-4 rounded-2xl bg-[#0b132b] border border-[#3a506b] flex items-center justify-between gap-3 text-xs">
                        <div className="flex-1">
                          <h4 className="font-bold text-white leading-snug">{item.product.title}</h4>
                          <span className="text-[#fbbf24] font-mono font-bold">₹{item.product.price.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-2 border border-[#3a506b] rounded-lg p-1 bg-[#1c2541]">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 text-gray-300 hover:text-white">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold px-2">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 text-gray-300 hover:text-white">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* STEP 2: CHECKOUT & UPI PAYMENT FORM */}
              {isCheckoutStep && !orderConfirmed && (
                <form onSubmit={handlePlaceShopOrder} className="py-6 space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Full Name<span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Laishram Surjit"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                        Mobile No.<span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+91 98620 00000"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                        WhatsApp No.
                      </label>
                      <input
                        type="text"
                        placeholder="Same as mobile"
                        value={whatsappNo}
                        onChange={(e) => setWhatsappNo(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Delivery Address & Landmark<span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="House No, Colony, City..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Pincode<span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="795001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-mono font-bold text-xs"
                    />
                  </div>

                  {/* UPI QR & UTR Box */}
                  <div className="p-4 rounded-2xl bg-[#0b132b] border border-[#3a506b] space-y-3 text-center">
                    <span className="text-[10px] font-bold text-[#fbbf24] uppercase block">Scan & Pay via Any UPI App</span>
                    <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-[#fbbf24]">
                      <div className="w-full h-full bg-[#0f172a] text-[#fbbf24] flex items-center justify-center font-bold text-xs font-mono">
                        UPI QR Code
                      </div>
                    </div>
                    <span className="text-xs text-gray-300 font-mono block">UPI ID: <strong>kangleiastro@upi</strong></span>

                    <div className="pt-2 border-t border-[#3a506b]/40 text-left">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                        12-Digit UPI Transaction Ref (UTR)<span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 429810998120"
                        value={utr}
                        onChange={(e) => setUtr(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#1c2541] text-[#fbbf24] font-mono font-bold text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95"
                  >
                    {isSubmitting ? 'Confirming Order...' : `Complete Order & Pay ₹${totalCartAmount}`}
                  </button>
                </form>
              )}

              {/* STEP 3: ORDER CONFIRMED THANK YOU SCREEN */}
              {orderConfirmed && (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif font-bold text-2xl text-[#fbbf24]">Order Confirmed!</h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Thank you for your order! Your payment UTR has been logged. Our team is preparing your authentic Vedic items for shipment.
                  </p>
                  <div className="p-4 rounded-xl bg-[#0b132b] border border-[#3a506b] text-xs font-bold text-green-300">
                    🚚 Order tracking link will be sent to your WhatsApp within 12 Hours!
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutStep(false);
                      setOrderConfirmed(false);
                    }}
                    className="w-full py-3 rounded-xl bg-[#d97706] text-white font-bold text-xs"
                  >
                    Back to E-Store
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && !isCheckoutStep && !orderConfirmed && (
              <div className="pt-4 border-t border-[#3a506b] space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span>Grand Total:</span>
                  <span className="text-[#fbbf24] font-mono text-xl">₹{totalCartAmount.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setIsCheckoutStep(true)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95"
                >
                  Proceed to UPI Checkout →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
