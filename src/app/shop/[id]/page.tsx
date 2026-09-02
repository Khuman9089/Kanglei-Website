'use client';

import React, { useState, useEffect, use } from 'react';
import { 
  ShoppingBag, Star, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, 
  ArrowLeft, Truck, Award, Heart, Share2, Plus, Minus, Tag, Check
} from 'lucide-react';
import Link from 'next/link';
import { ProductItem, ProductVariant } from '@/app/api/shop/route';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ENERGIZATION' | 'HOW_TO_WEAR' | 'ASTROLOGER'>('OVERVIEW');
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    fetch('/api/shop')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          const found = data.products.find((p: any) => p.id === productId);
          if (found) {
            setProduct(found);
            setSelectedImage(found.image);
            if (found.variants && found.variants.length > 0) {
              setSelectedVariant(found.variants[0]);
            }
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching product:', err);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#d97706] border-t-transparent animate-spin mx-auto" />
          <h3 className="font-serif font-bold text-lg text-[#0f172a]">Loading Sacred Product Details...</h3>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex items-center justify-center font-sans p-6">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-3xl border border-[#f3e8d2] shadow-xl">
          <ShoppingBag className="w-16 h-16 text-[#d97706] mx-auto opacity-40" />
          <h2 className="font-serif font-bold text-2xl text-[#0f172a]">Product Not Found</h2>
          <p className="text-xs text-gray-600">The product you are looking for may have been updated or removed.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#d97706] text-white font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to E-Store</span>
          </Link>
        </div>
      </div>
    );
  }

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const discountPct = product.originalPrice > currentPrice
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
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

      const cartItemId = selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id;

      const existingIndex = cartItems.findIndex((it) => it.id === cartItemId);
      if (existingIndex >= 0) {
        cartItems[existingIndex].quantity += quantity;
      } else {
        cartItems.push({
          id: cartItemId,
          productId: product.id,
          variantId: selectedVariant?.id,
          variantName: selectedVariant?.name,
          title: product.title,
          price: currentPrice,
          originalPrice: product.originalPrice,
          image: selectedImage || product.image,
          quantity: quantity,
        });
      }

      localStorage.setItem('kanglei_cart', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('cart-updated'));
      window.dispatchEvent(new Event('open-cart-drawer'));

      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] font-sans antialiased">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-20 space-y-8">
        
        {/* Back Link Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#b45309] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Products</span>
          </Link>
          <span className="text-xs text-gray-500 font-medium">Category: <strong className="font-bold text-[#0f172a]">{product.category}</strong></span>
        </div>

        {/* 1. TOP PRODUCT SHOWCASE (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          
          {/* LEFT: MULTI-IMAGE GALLERY (col-span-6) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Featured Display Image */}
            <div className="w-full h-80 sm:h-100 rounded-3xl overflow-hidden border-2 border-[#f3e8d2] shadow-lg relative bg-white flex items-center justify-center">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-[#0f172a]/90 text-[#fbbf24] text-xs font-extrabold uppercase tracking-wider backdrop-blur-xs border border-[#fbbf24]/30">
                {product.badge || 'AUTHENTIC VEDIC'}
              </span>
              {discountPct > 0 && (
                <span className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-green-600 text-white text-xs font-black shadow-md">
                  {discountPct}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Carousel Selector */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-white shrink-0 ${
                      selectedImage === imgUrl ? 'border-[#d97706] ring-2 ring-[#d97706]/30 scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* ASTROLOGICAL & GEMSTONE SPECIFICATIONS GRID (MATCH LIGHT THEME & PLACED BELOW PRODUCT IMAGE) */}
            {(product.rulingPlanet || product.zodiacRashi || product.origin || product.rattiWeight) && (
              <div className="p-5 rounded-3xl bg-[#fefcf6] border-2 border-[#fde68a] space-y-4 shadow-lg text-[#0f172a] mt-4">
                <div className="flex items-center justify-between border-b border-[#fde68a] pb-3">
                  <span className="text-xs font-black text-[#b45309] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#d97706]" />
                    Vedic Planetary Specifications
                  </span>
                  {product.sku && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-white border border-[#fde68a] font-mono text-[10px] font-extrabold text-[#b45309] shadow-2xs">
                      SKU: {product.sku}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  {product.rulingPlanet && (
                    <div>
                      <span className="text-gray-500 text-[10px] font-bold block uppercase tracking-wider mb-0.5">Ruling Planet</span>
                      <span className="font-extrabold text-[#b45309]">🪐 {product.rulingPlanet}</span>
                    </div>
                  )}
                  {product.zodiacRashi && (
                    <div>
                      <span className="text-gray-500 text-[10px] font-bold block uppercase tracking-wider mb-0.5">Zodiac Rashi</span>
                      <span className="font-extrabold text-[#b45309]">♈ {product.zodiacRashi}</span>
                    </div>
                  )}
                  {(product.rattiWeight || product.caratWeight) && (
                    <div>
                      <span className="text-gray-500 text-[10px] font-bold block uppercase tracking-wider mb-0.5">Weight (Carat / Ratti)</span>
                      <span className="font-black text-[#0f172a] font-mono">⚖️ {product.caratWeight ? `${product.caratWeight} Ct` : ''} ({product.rattiWeight} Ratti)</span>
                    </div>
                  )}
                  {product.origin && (
                    <div>
                      <span className="text-gray-500 text-[10px] font-bold block uppercase tracking-wider mb-0.5">Origin</span>
                      <span className="font-extrabold text-gray-900">🌍 {product.origin}</span>
                    </div>
                  )}
                  {product.color && (
                    <div>
                      <span className="text-gray-500 text-[10px] font-bold block uppercase tracking-wider mb-0.5">Color &amp; Hue</span>
                      <span className="font-bold text-gray-800">💎 {product.color}</span>
                    </div>
                  )}
                  {product.certification && (
                    <div>
                      <span className="text-gray-500 text-[10px] font-bold block uppercase tracking-wider mb-0.5">Lab Certification</span>
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">🔬 {product.certification}</span>
                    </div>
                  )}
                  {product.recommendedMetal && (
                    <div>
                      <span className="text-gray-500 text-[10px] font-bold block uppercase tracking-wider mb-0.5">Recommended Metal</span>
                      <span className="font-bold text-[#78350f]">🪙 {product.recommendedMetal}</span>
                    </div>
                  )}
                  {product.wearingFinger && (
                    <div>
                      <span className="text-gray-500 text-[10px] font-bold block uppercase tracking-wider mb-0.5">Wearing Finger</span>
                      <span className="font-bold text-gray-800">🖐️ {product.wearingFinger}</span>
                    </div>
                  )}
                </div>

                {product.vedicMantra && (
                  <div className="pt-3 border-t border-[#fde68a] space-y-1">
                    <span className="text-[10px] font-extrabold text-[#b45309] uppercase tracking-wider block">Consecration Vedic Mantra:</span>
                    <p className="text-xs font-serif italic text-[#78350f] font-bold bg-white p-2.5 rounded-xl border border-[#fde68a] shadow-2xs">
                      📿 &quot;{product.vedicMantra}&quot;
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS, VARIANTS & BUY ACTIONS (col-span-6) */}
          <div className="lg:col-span-6 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="ml-1 text-sm font-black">{product.rating}</span>
                </div>
                <span className="text-gray-400 font-normal">({product.reviewsCount} customer reviews)</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px] font-extrabold">
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                </span>
              </div>

              <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#0f172a] leading-tight">
                {product.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
                {product.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a] flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold block">Current Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#b45309] font-mono">₹{currentPrice.toLocaleString()}</span>
                  {product.originalPrice > currentPrice && (
                    <span className="text-sm text-gray-400 line-through font-mono">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-green-700 font-extrabold uppercase block">Nationwide Delivery</span>
                <span className="text-xs font-bold text-gray-700">Dispatched in 24 Hours</span>
              </div>
            </div>

            {/* Product Variants (if applicable) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                  Select Weight / Carat Option<span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variants.map((vrt) => (
                    <button
                      key={vrt.id}
                      onClick={() => setSelectedVariant(vrt)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                        selectedVariant?.id === vrt.id
                          ? 'border-[#d97706] bg-[#fef3c7] text-[#78350f] shadow-xs'
                          : 'border-gray-200 bg-[#fefcf6] text-gray-700 hover:border-[#d97706]'
                      }`}
                    >
                      <div className="font-extrabold">{vrt.name}</div>
                      <div className="text-[11px] font-mono text-[#b45309] mt-0.5">₹{vrt.price.toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-xl bg-[#fefcf6] overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 font-bold text-gray-700 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-sm font-mono text-[#0f172a]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 font-bold text-gray-700 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add {quantity} to Shopping Cart</span>
                </button>
              </div>

              {addedNotice && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-300 text-green-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Item added to your cart! Slide-out drawer opened.</span>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-3 text-xs text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#d97706]" />
                <span>100% Original Govt. Lab Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#d97706]" />
                <span>Pandit Consecrated & Energized</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#d97706]" />
                <span>Express Insured Courier Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d97706]" />
                <span>Instant WhatsApp Dispatch Alert</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. RITUAL & SPECIFICATION TABS */}
        <div className="bg-white rounded-3xl border border-[#f3e8d2] shadow-lg p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'OVERVIEW', label: '🌟 Product Overview & Features' },
              { id: 'ENERGIZATION', label: '✨ Pran Pratishta & Consecration' },
              { id: 'HOW_TO_WEAR', label: '📜 How to Wear / Wearing Rituals' },
              { id: 'ASTROLOGER', label: '🔮 Astrologer Guidance' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-xs font-extrabold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#d97706] text-[#b45309]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans space-y-4">
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <div className="space-y-2">
                  <h4 className="font-bold text-[#0f172a] uppercase text-xs">Key Product Features:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features?.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#fefcf6] border border-[#fde68a]">
                        <CheckCircle2 className="w-4 h-4 text-[#d97706] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'ENERGIZATION' && (
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-lg text-[#0f172a]">Vedic Consecration Process</h4>
                <p>
                  Every gemstone and sacred item ordered from KuthiYengpham undergoes rigorous 8-stage Vedic purification (*Panchamrut Shuddhi*) and *Pran Pratishta* rituals at our dedicated altar by Acharya Tombi Sharma and panel pandits.
                </p>
                <div className="p-4 rounded-2xl bg-[#fef3c7]/60 border border-[#fde68a] font-bold text-[#78350f]">
                  ✦ Consecrated with targeted planetary Beej Mantras prior to dispatch to ensure maximum positive energy alignment.
                </div>
              </div>
            )}

            {activeTab === 'HOW_TO_WEAR' && (
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-lg text-[#0f172a]">Auspicious Muhurat & Wearing Instructions</h4>
                <p>
                  {product.wearingRituals || 'Wear on Thursday morning during Shukla Paksha Muhurat after dipping in unpasteurized milk and Gangajal. Chant the corresponding planetary Beej Mantra 108 times before placing on the specified finger.'}
                </p>
              </div>
            )}

            {activeTab === 'ASTROLOGER' && (
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-lg text-[#0f172a]">Seller & Astrologer Information</h4>
                <p>
                  Seller: <strong>{product.sellerName || 'KangleiAstro Store'}</strong> ({product.sellerType || 'PLATFORM'}).
                </p>
                <p>
                  Need personalized advice on whether this gemstone or remedy is suitable for your birth chart? Book a live consultation with our empaneled Vedic astrologers at <Link href="/astrologers" className="text-[#b45309] font-bold underline">Astrologer Bureau</Link>.
                </p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
