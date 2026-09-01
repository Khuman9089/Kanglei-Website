'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, Truck, CreditCard, 
  MapPin, Phone, User, QrCode, Lock, ArrowRight, AlertCircle, Copy, Check
} from 'lucide-react';
import Link from 'next/link';
import { CartItem } from '@/components/shop/CartDrawer';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [buyerName, setBuyerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [sameWhatsapp, setSameWhatsapp] = useState(true);
  const [whatsappNo, setWhatsappNo] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [utr, setUtr] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [formError, setFormError] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('kanglei_cart');
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (e) {
          setCartItems([]);
        }
      }

      const storedCoupon = localStorage.getItem('kanglei_checkout_applied_coupon');
      if (storedCoupon) {
        try {
          setAppliedCoupon(JSON.parse(storedCoupon));
        } catch (e) {
          setAppliedCoupon(null);
        }
      }

      // Pre-fill user details if logged in
      const storedUser = localStorage.getItem('kanglei_user');
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u.name) setBuyerName(u.name);
          if (u.mobile) {
            setMobile(u.mobile);
            setWhatsappNo(u.mobile);
          }
        } catch (e) {}
      }

      setLoading(false);
    }
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  let discountAmount = 0;
  let isFreeShipping = subtotal >= 499;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'FREE_SHIPPING') {
      isFreeShipping = true;
    } else if (appliedCoupon.type === 'PERCENTAGE') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'FLAT') {
      discountAmount = Math.min(subtotal, appliedCoupon.value);
    }
  }

  const shippingFee = subtotal === 0 ? 0 : (isFreeShipping ? 0 : 50);
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleCopyUpi = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('kangleiastro@upi');
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (cartItems.length === 0) {
      setFormError('Your cart is empty.');
      return;
    }

    if (!buyerName.trim() || !mobile.trim() || !address.trim() || !pincode.trim()) {
      setFormError('Please fill out all required shipping fields.');
      return;
    }

    if (!utr.trim() || utr.trim().length < 8) {
      setFormError('Please enter a valid 12-Digit UPI Reference/UTR Number after making payment.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PLACE_ORDER',
          buyerName: buyerName.trim(),
          mobile: mobile.trim(),
          whatsappNo: sameWhatsapp ? mobile.trim() : whatsappNo.trim(),
          address: address.trim(),
          pincode: pincode.trim(),
          items: cartItems,
          subtotalAmount: subtotal,
          discountAmount,
          couponCode: appliedCoupon?.code || '',
          shippingFee,
          totalAmount: finalTotal,
          utr: utr.trim(),
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success && data.order) {
        setCreatedOrder(data.order);
        setOrderConfirmed(true);

        // Clear cart & checkout storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('kanglei_cart');
          localStorage.removeItem('kanglei_checkout_applied_coupon');
          window.dispatchEvent(new Event('cart-updated'));
        }
      } else {
        setFormError(data.error || 'Failed to place order. Please try again.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setFormError(err.message || 'Network error occurred during checkout.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#d97706] border-t-transparent animate-spin mx-auto" />
          <h3 className="font-serif font-bold text-lg text-[#0f172a]">Loading Checkout Details...</h3>
        </div>
      </div>
    );
  }

  if (orderConfirmed && createdOrder) {
    return (
      <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] font-sans antialiased py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border-2 border-[#b45309] shadow-2xl space-y-6 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 border-2 border-green-400 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] font-extrabold text-xs uppercase tracking-wider border border-[#fde68a]">
              Order #{createdOrder.orderRef}
            </span>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#0f172a] mt-3">
              Order Confirmed!
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-md mx-auto">
              Thank you, <strong className="font-bold text-[#0f172a]">{createdOrder.buyerName}</strong>! Your order with UTR <code className="bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-mono text-[#b45309] font-bold">{createdOrder.utr}</code> has been logged and verified.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#fefcf6] border border-[#fde68a] text-left space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#fde68a] pb-2">
              <span className="font-bold text-gray-600">Total Amount Paid:</span>
              <span className="font-mono font-black text-lg text-[#b45309]">₹{createdOrder.totalAmount}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#fde68a] pb-2">
              <span className="font-bold text-gray-600">Delivery Address:</span>
              <span className="font-medium text-gray-800 text-right max-w-xs">{createdOrder.address}, PIN {createdOrder.pincode}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-600">WhatsApp Notification:</span>
              <span className="font-semibold text-green-700">{createdOrder.whatsappNo}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b132b] text-white border border-[#3a506b] text-xs font-semibold space-y-1">
            <div className="flex items-center justify-center gap-2 text-[#fbbf24] font-bold">
              <Truck className="w-4 h-4" />
              <span>Express Delivery Dispatch</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Your authentic items are now being consecrated with Panchamrut rituals and dispatched within 24 Hours. Tracking URL will be sent to your WhatsApp.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 px-6 rounded-xl border border-gray-300 text-gray-700 font-extrabold text-xs text-center hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] font-sans antialiased">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#b45309] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to E-Store</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <Lock className="w-3.5 h-3.5 text-green-600" />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#0f172a]">
            Express Order & Payment
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
            Provide your shipping address and enter your 12-Digit UPI UTR reference to finalize your order.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#f3e8d2] space-y-4 max-w-md mx-auto">
            <ShoppingBag className="w-14 h-14 text-[#d97706] mx-auto opacity-40" />
            <h3 className="font-serif font-bold text-xl text-[#0f172a]">Your Cart is Empty</h3>
            <p className="text-xs text-gray-500">Add gemstones, Rudraksha, or scriptures from our store before proceeding to checkout.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#d97706] text-white font-bold text-xs shadow-md"
            >
              <span>Explore E-Store</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: FORM (col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                
                {/* 1. SHIPPING DETAILS CARD */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-lg space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center font-black text-sm">
                      1
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Shipping & Contact Details</h3>
                  </div>

                  {formError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                        Full Name<span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sanatombi Devi"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-semibold text-[#0f172a] focus:border-[#d97706] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                        Mobile Number<span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9862011223"
                          value={mobile}
                          onChange={(e) => {
                            setMobile(e.target.value);
                            if (sameWhatsapp) setWhatsappNo(e.target.value);
                          }}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-semibold text-[#0f172a] focus:border-[#d97706] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameWhatsapp}
                        onChange={(e) => {
                          setSameWhatsapp(e.target.checked);
                          if (e.target.checked) setWhatsappNo(mobile);
                        }}
                        className="rounded border-gray-300 text-[#d97706] focus:ring-[#d97706]"
                      />
                      <span>WhatsApp number same as Mobile Number</span>
                    </label>

                    {!sameWhatsapp && (
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                          WhatsApp Number<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9862011223"
                          value={whatsappNo}
                          onChange={(e) => setWhatsappNo(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-semibold text-[#0f172a] focus:border-[#d97706] focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                      Complete Shipping Address<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <textarea
                        required
                        rows={3}
                        placeholder="House / Flat No., Colony / Leikai, Landmark, City, State"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-semibold text-[#0f172a] focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 space-y-1">
                    <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                      Pincode<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 795001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-semibold text-[#0f172a] focus:border-[#d97706] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* 2. UPI PAYMENT STEP CARD */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-lg space-y-5">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center font-black text-sm">
                        2
                      </div>
                      <h3 className="font-serif font-bold text-xl text-[#0f172a]">UPI Payment Instructions</h3>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold border border-emerald-200">
                      0% Payment Gateway Fee
                    </span>
                  </div>

                  {/* UPI Box */}
                  <div className="p-5 rounded-2xl bg-[#0b132b] text-white border-2 border-[#b45309] space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] text-[#fbbf24] font-extrabold uppercase tracking-widest block">Official Merchant UPI</span>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xl font-mono font-black text-white bg-[#1c2541] px-3 py-1 rounded-xl border border-[#3a506b]">
                            kangleiastro@upi
                          </code>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="p-2 rounded-xl bg-[#d97706] text-white hover:bg-[#b45309] transition-colors cursor-pointer"
                            title="Copy UPI ID"
                          >
                            {copiedUpi ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        {copiedUpi && <span className="text-[10px] text-green-400 font-bold block mt-1">UPI ID Copied!</span>}
                      </div>

                      <div className="text-center sm:text-right">
                        <span className="text-[10px] text-slate-400 font-medium block">Total Payable Amount:</span>
                        <span className="text-2xl font-black text-[#fbbf24] font-mono">₹{finalTotal}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-[#3a506b]/60">
                      Pay via <strong>GPay, PhonePe, Paytm, or BHIM UPI</strong> app to the address above. After successful payment, enter your 12-Digit Reference (UTR) number below.
                    </p>

                    <div className="space-y-1 pt-1">
                      <label className="block text-xs font-bold text-[#fbbf24] uppercase tracking-wider">
                        12-Digit UPI Transaction Reference Number (UTR)<span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 429810998120"
                        value={utr}
                        onChange={(e) => setUtr(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border-2 border-[#d97706] bg-[#1c2541] text-[#fbbf24] font-mono font-black text-sm tracking-wider focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-sm shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>{isSubmitting ? 'Confirming Order...' : `Complete Order & Pay ₹${finalTotal}`}</span>
                  </button>

                </div>

              </form>

            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR (col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-lg space-y-5 sticky top-6">
                <h3 className="font-serif font-bold text-xl text-[#0f172a] border-b border-gray-100 pb-3">
                  Order Summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                </h3>

                {/* Items list */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#fefcf6] border border-[#fde68a]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0 bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-[#0f172a] truncate">{item.title}</h4>
                        {item.variantName && (
                          <span className="text-[10px] text-[#b45309] font-semibold block">{item.variantName}</span>
                        )}
                        <span className="text-[11px] text-gray-500 font-medium">Qty: {item.quantity}</span>
                      </div>
                      <div className="font-mono font-bold text-xs text-[#b45309]">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2 text-xs border-t border-b border-gray-200 py-3 font-sans">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold text-gray-900">₹{subtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-700 font-bold">
                      <span>Promo Discount ({appliedCoupon?.code}):</span>
                      <span className="font-mono">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Nationwide Delivery:</span>
                    <span className="font-bold font-mono text-gray-900">
                      {shippingFee === 0 ? <span className="text-green-600 uppercase font-black text-[10px]">FREE</span> : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-[#0f172a] pt-2 border-t border-gray-200">
                    <span>Total Amount Payable:</span>
                    <span className="font-mono font-black text-xl text-[#b45309]">₹{finalTotal}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-600 pt-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#d97706]" />
                    <span>100% Authentic Consecrated Vedic Items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#d97706]" />
                    <span>Fast Dispatch via Insured Courier Partner</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
