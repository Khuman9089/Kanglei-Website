'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingBag, Star, ShieldCheck, Sparkles, ArrowLeft, ArrowRight, CheckCircle2, 
  Truck, Award, RotateCcw, Lock, CreditCard, X, Check
} from 'lucide-react';

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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Instant Checkout Modal
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [utr, setUtr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    fetch('/api/shop')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          const found = data.products.find((p: ProductItem) => p.id === productId);
          setProduct(found || data.products[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [productId]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !buyerName || !mobile || !address || !pincode || !utr) return;

    setIsSubmitting(true);

    const orderPayload = {
      action: 'PLACE_ORDER',
      buyerName,
      mobile,
      whatsappNo: whatsappNo || mobile,
      address,
      pincode,
      items: [
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity,
        },
      ],
      totalAmount: product.price * quantity,
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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex items-center justify-center pt-32 pb-20">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#d97706] border-t-transparent animate-spin mx-auto" />
          <p className="font-serif font-bold text-lg text-[#0f172a]">Loading Product Details...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] font-sans pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#b45309] hover:text-[#d97706] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to E-Store Directory</span>
        </Link>

        {/* Product Details 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Product Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="w-full h-[420px] rounded-3xl bg-cover bg-center border border-[#f3e8d2] shadow-[0_10px_40px_rgba(217,119,6,0.08)] relative overflow-hidden" style={{ backgroundImage: `url(${product.image})` }}>
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-[#0f172a]/90 backdrop-blur-xs text-[#fbbf24] text-xs font-extrabold uppercase border border-[#fbbf24]/30">
                  {product.badge}
                </span>

                {discountPct > 0 && (
                  <span className="px-3 py-1 rounded-full bg-green-600 text-white font-extrabold text-xs shadow-md">
                    {discountPct}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-2xl bg-white border border-[#f3e8d2] space-y-1">
                <Award className="w-5 h-5 text-[#d97706] mx-auto" />
                <span className="font-bold text-[#0f172a] block text-[11px]">Lab Certified</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#f3e8d2] space-y-1">
                <Truck className="w-5 h-5 text-[#d97706] mx-auto" />
                <span className="font-bold text-[#0f172a] block text-[11px]">Fast Delivery</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#f3e8d2] space-y-1">
                <ShieldCheck className="w-5 h-5 text-[#d97706] mx-auto" />
                <span className="font-bold text-[#0f172a] block text-[11px]">Puja Consecrated</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specifications & Checkout Action */}
          <div className="lg:col-span-6 space-y-6">
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-md bg-[#fef3c7] text-[#b45309] text-xs font-bold uppercase border border-[#fde68a]">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold ml-auto">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400 font-normal">({product.reviewsCount} verified reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0f172a] leading-tight mb-3">
                {product.title}
              </h1>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#b45309] font-mono">₹{product.price.toLocaleString()}</span>
                <span className="text-base text-gray-400 line-through font-mono">₹{product.originalPrice.toLocaleString()}</span>
                <span className="text-xs text-emerald-600 font-extrabold ml-auto">In Stock ({product.stock} items remaining)</span>
              </div>
            </div>

            {/* Description */}
            <div className="p-5 rounded-2xl bg-white border border-[#f3e8d2] space-y-2">
              <span className="text-xs font-bold text-[#b45309] uppercase tracking-wider block">Description & Vedic Benefits</span>
              <p className="text-gray-700 text-sm leading-relaxed font-medium">{product.description}</p>
            </div>

            {/* Included Features */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider block">Key Specifications & Guarantee</span>
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 font-medium bg-white p-3 rounded-xl border border-[#f3e8d2]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Quantity & Buy Button */}
            <div className="pt-4 border-t border-[#f3e8d2] space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">Quantity:</label>
                <div className="flex items-center border border-[#f3e8d2] rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-gray-100 text-[#0f172a] font-bold text-sm hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold font-mono text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-gray-100 text-[#0f172a] font-bold text-sm hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>

                <div className="ml-auto text-right">
                  <span className="text-[10px] text-gray-500 font-bold block uppercase">Subtotal</span>
                  <span className="text-xl font-extrabold text-[#b45309] font-mono">₹{(product.price * quantity).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setShowCheckoutModal(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-sm tracking-wide shadow-lg hover:shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Buy Now & Pay via UPI (₹{(product.price * quantity).toLocaleString()})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
         INSTANT CHECKOUT MODAL
         ───────────────────────────────────────────────────────────── */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-[#0b132b]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1c2541] w-full max-w-lg rounded-3xl border border-[#3a506b] shadow-2xl overflow-hidden relative text-left font-sans text-white p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#3a506b] pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#fbbf24]" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Direct Order & UPI Checkout</h3>
                  <p className="text-xs text-slate-300">{product.title} (x{quantity})</p>
                </div>
              </div>
              <button onClick={() => setShowCheckoutModal(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!orderConfirmed ? (
              <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                    Buyer Name<span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
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
                    Shipping Address & Landmark<span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="House No, Colony, City, State..."
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

                {/* UPI QR Box */}
                <div className="p-4 rounded-2xl bg-[#0b132b] border border-[#3a506b] space-y-2 text-center">
                  <span className="text-[10px] font-bold text-[#fbbf24] uppercase block">Scan & Pay via GPay / PhonePe / Paytm</span>
                  <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl border border-[#fbbf24]">
                    <div className="w-full h-full bg-[#0f172a] text-[#fbbf24] flex items-center justify-center font-bold text-[10px] font-mono">
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

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#0b132b] text-gray-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95"
                  >
                    {isSubmitting ? 'Confirming Order...' : `Confirm & Pay ₹${(product.price * quantity).toLocaleString()}`}
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-2xl text-[#fbbf24]">Order Placed Successfully!</h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Thank you! Your order reference and tracking updates will be dispatched to your phone/WhatsApp.
                </p>
                <button
                  onClick={() => router.push('/shop')}
                  className="px-6 py-3 rounded-xl bg-[#d97706] text-white font-bold text-xs"
                >
                  Return to E-Store
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
