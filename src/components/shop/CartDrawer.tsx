'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, Tag, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export interface CartItem {
  id: string; // unique item id: productId or productId-variantId
  productId: string;
  variantId?: string;
  variantName?: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
}

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Synchronize cart with localStorage & custom events
  const loadCart = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kanglei_cart');
      if (stored) {
        try {
          setCartItems(JSON.parse(stored));
        } catch (e) {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }
  };

  useEffect(() => {
    loadCart();

    const handleOpenCart = () => {
      loadCart();
      setIsOpen(true);
    };

    window.addEventListener('open-cart-drawer', handleOpenCart);
    window.addEventListener('storage', loadCart);
    return () => {
      window.removeEventListener('open-cart-drawer', handleOpenCart);
      window.removeEventListener('storage', loadCart);
    };
  }, []);

  const updateLocalStorage = (items: CartItem[]) => {
    setCartItems(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kanglei_cart', JSON.stringify(items));
      window.dispatchEvent(new Event('cart-updated'));
    }
  };

  const handleQuantityChange = (id: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    updateLocalStorage(updated);
  };

  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateLocalStorage(updated);
  };

  // Subtotal Calculation
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 499;
  const isFreeShipping = subtotal >= freeShippingThreshold || appliedCoupon?.type === 'FREE_SHIPPING';
  const shippingFee = subtotal === 0 ? 0 : (isFreeShipping ? 0 : 50);

  // Recalculate coupon discount when subtotal changes
  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      if (subtotal < appliedCoupon.minOrderAmount) {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponMsg('');
        setCouponError(`Coupon removed: Subtotal fell below minimum ₹${appliedCoupon.minOrderAmount}`);
      } else if (appliedCoupon.type === 'PERCENTAGE') {
        const disc = Math.round((subtotal * appliedCoupon.value) / 100);
        setDiscountAmount(disc);
      } else if (appliedCoupon.type === 'FLAT') {
        const disc = Math.min(subtotal, appliedCoupon.value);
        setDiscountAmount(disc);
      }
    } else if (subtotal === 0) {
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setCouponMsg('');
    }
  }, [subtotal, appliedCoupon]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponMsg('');

    if (!couponCode.trim()) return;
    setValidatingCoupon(true);

    fetch('/api/shop/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'VALIDATE',
        code: couponCode,
        subtotal,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setValidatingCoupon(false);
        if (data.valid) {
          setAppliedCoupon(data.coupon);
          setDiscountAmount(data.discountAmount || 0);
          setCouponMsg(data.message);
        } else {
          setCouponError(data.message || 'Invalid coupon code');
        }
      })
      .catch(() => {
        setValidatingCoupon(false);
        setCouponError('Failed to validate coupon code');
      });
  };

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col font-sans text-[#0f172a]"
          >
            {/* Header */}
            <div className="p-5 bg-[#fefcf6] border-b border-[#fde68a] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#0f172a]">Your Shopping Cart</h3>
                  <p className="text-[11px] text-gray-500">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {subtotal > 0 && (
              <div className="px-5 py-2.5 bg-[#fef3c7]/60 border-b border-[#fde68a] text-xs font-semibold text-[#78350f]">
                {isFreeShipping ? (
                  <div className="flex items-center gap-1.5 text-green-700 font-extrabold">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <span>🎉 You unlocked FREE Nationwide Delivery!</span>
                  </div>
                ) : (
                  <div>
                    <span>Add <strong className="font-bold text-[#b45309]">₹{freeShippingThreshold - subtotal}</strong> more for FREE Shipping!</span>
                    <div className="w-full h-1.5 bg-amber-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-[#d97706] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart Items List Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center mx-auto border border-[#fde68a]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xl text-[#0f172a]">Your Cart is Empty</h4>
                    <p className="text-xs text-gray-500 mt-1">Explore our sacred gemstones, Rudraksha malas, and Yantras</p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95"
                  >
                    <span>Browse E-Store</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#fefcf6] border border-[#fde68a] flex items-center gap-3 relative"
                  >
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=200'}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0 bg-white"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-[#0f172a] truncate">{item.title}</h4>
                      {item.variantName && (
                        <span className="text-[10px] text-[#b45309] font-semibold block">{item.variantName}</span>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono font-extrabold text-sm text-[#b45309]">₹{item.price}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="font-mono text-[10px] text-gray-400 line-through">₹{item.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden text-xs">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="px-2 py-1 hover:bg-gray-100 cursor-pointer font-bold"
                        >
                          <Minus className="w-3 h-3 text-gray-700" />
                        </button>
                        <span className="px-2.5 font-bold text-xs font-mono">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="px-2 py-1 hover:bg-gray-100 cursor-pointer font-bold"
                        >
                          <Plus className="w-3 h-3 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Action */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-[#fefcf6] border-t border-[#fde68a] space-y-4">
                
                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-[#d97706] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Enter Promo Code (e.g. KANGLEI20)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="w-full h-9 pl-9 pr-3 rounded-xl border border-gray-300 bg-white text-xs font-mono font-bold text-[#0f172a] uppercase focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={validatingCoupon || !couponCode.trim()}
                      className="px-4 h-9 rounded-xl bg-[#0f172a] text-[#fbbf24] font-bold text-xs hover:bg-[#1e293b] disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {validatingCoupon ? 'Validating...' : 'Apply'}
                    </button>
                  </div>

                  {couponMsg && (
                    <p className="text-[11px] font-bold text-green-700 flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{couponMsg}</span>
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[11px] font-bold text-red-600 mt-1">⚠️ {couponError}</p>
                  )}
                </form>

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs font-sans border-t border-b border-gray-200 py-2.5">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items):</span>
                    <span className="font-mono font-bold text-gray-900">₹{subtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-700 font-bold">
                      <span>Promo Code Discount ({appliedCoupon?.code}):</span>
                      <span className="font-mono">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Nationwide Delivery:</span>
                    <span className="font-bold font-mono text-gray-900">
                      {shippingFee === 0 ? <span className="text-green-600 uppercase font-black text-[10px]">FREE</span> : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-[#0f172a] pt-1 border-t border-gray-200">
                    <span>Total Amount Payable:</span>
                    <span className="font-mono font-extrabold text-base text-[#b45309]">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={() => {
                    // Save total & coupon state before checkout
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('kanglei_checkout_applied_coupon', JSON.stringify(appliedCoupon));
                    }
                    setIsOpen(false);
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Express Checkout (₹{finalTotal})</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>100% Consecrated Items • Lab Tested & Guaranteed</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
