'use client';

import React, { useState, useEffect, use } from 'react';
import { 
  ShoppingBag, Star, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, 
  ArrowLeft, Truck, Award, Heart, Share2, Plus, Minus, Tag, Check, Zap
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-28 md:pb-20 space-y-8">
        
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
            <div className="w-full h-52 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#f3e8d2] shadow-md relative bg-white flex items-center justify-center max-w-sm sm:max-w-none mx-auto">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-[#0f172a]/90 text-[#fbbf24] text-[10px] sm:text-xs font-extrabold uppercase tracking-wider backdrop-blur-xs border border-[#fbbf24]/30">
                {product.badge || 'AUTHENTIC VEDIC'}
              </span>
              {discountPct > 0 && (
                <span className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-green-600 text-white text-[10px] sm:text-xs font-black shadow-md">
                  {discountPct}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Carousel Selector */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1.5">
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-white shrink-0 ${
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

          {/* RIGHT: DETAILS, VARIANTS, PACK OPTIONS & BUY ACTIONS (col-span-6) */}
          <ProductDetailRightColumn product={product} selectedImage={selectedImage} />
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

function ProductDetailRightColumn({
  product,
  selectedImage,
}: {
  product: ProductItem;
  selectedImage: string;
}) {
  const defaultPackOptions = [
    {
      id: 'pack-1',
      packSize: 1,
      label: 'Pack of 1',
      price: product.price,
      originalPrice: product.originalPrice || Math.round(product.price * 1.4),
      savingsText: '',
    },
    {
      id: 'pack-2',
      packSize: 2,
      label: 'Pack of 2',
      price: Math.round(product.price * 1.5),
      originalPrice: Math.round((product.originalPrice || product.price * 1.4) * 2),
      badge: 'Most Popular',
      savingsText: `Extra ₹${Math.round(product.price * 0.5)} Off`,
    },
    {
      id: 'pack-3',
      packSize: 3,
      label: 'Pack of 3',
      price: Math.round(product.price * 2.0),
      originalPrice: Math.round((product.originalPrice || product.price * 1.4) * 3),
      savingsText: `Extra ₹${product.price} Off`,
    },
  ];

  const availablePacks =
    product.packOptions && product.packOptions.length > 0
      ? product.packOptions
      : defaultPackOptions;

  const [selectedPackId, setSelectedPackId] = useState<string>(availablePacks[1]?.id || availablePacks[0]?.id || 'pack-2');
  const activePack = availablePacks.find((p) => p.id === selectedPackId) || availablePacks[0];

  const initialHours = product.offerEndsInHours || 16;
  const [showOfferDetails, setShowOfferDetails] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: initialHours, minutes: 40, seconds: 16 });

  useEffect(() => {
    setTimeLeft({ hours: product.offerEndsInHours || 16, minutes: 40, seconds: 16 });
  }, [product.offerEndsInHours]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: product.offerEndsInHours || 16, minutes: 40, seconds: 16 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [product.offerEndsInHours]);

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

      const cartItemId = `${product.id}-${activePack.id}`;
      const itemTitle = `${product.title} (${activePack.label})`;
      const packQty = activePack.packSize || 1;

      const existingIndex = cartItems.findIndex((it) => it.id === cartItemId);
      if (existingIndex >= 0) {
        cartItems[existingIndex].quantity += 1;
      } else {
        cartItems.push({
          id: cartItemId,
          productId: product.id,
          title: itemTitle,
          price: activePack.price,
          originalPrice: activePack.originalPrice || ((product.originalPrice || product.price * 1.2) * packQty),
          image: selectedImage || product.image,
          quantity: 1,
          packSize: packQty,
          packLabel: activePack.label,
        });
      }

      localStorage.setItem('kanglei_cart', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('cart-updated'));
      window.dispatchEvent(new Event('open-cart-drawer'));

      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 3000);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (typeof window !== 'undefined') {
      window.location.href = '/checkout';
    }
  };

  return (
    <div className="lg:col-span-6 space-y-4 bg-white p-5 sm:p-7 rounded-3xl border border-[#f3e8d2] shadow-xl">
      {/* Title & Reviews */}
      <div className="space-y-2.5">
        <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#0f172a] leading-snug">
          {product.title}
        </h1>

        {/* Reviews Star Rating */}
        <div className="flex items-center gap-2 text-[11px] font-medium text-gray-600">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1 text-[11px] font-bold text-gray-800">{product.reviewsCount || 169} reviews</span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] font-bold">
            {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
          </span>
        </div>

        {/* Custom Badges Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {(product.specialBadges && product.specialBadges.length > 0
            ? product.specialBadges
            : ['Blessed by Lord Murugan & Lord Shiva', 'Daily Shield & Spiritual Guide']
          ).map((badgeText, bIdx) => (
            <span
              key={bIdx}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                bIdx === 0
                  ? 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              {badgeText}
            </span>
          ))}
        </div>
      </div>

      {/* Price Header */}
      <div className="flex items-baseline gap-2.5 pt-1">
        <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-mono">
          ₹{activePack.price.toLocaleString()}
        </span>
        {activePack.originalPrice && activePack.originalPrice > activePack.price && (
          <span className="text-sm text-gray-400 line-through font-mono">
            ₹{activePack.originalPrice.toLocaleString()}
          </span>
        )}
        <span className="text-[11px] font-bold text-emerald-600">
          16% + Extra 26% OFF
        </span>
      </div>

      {/* SELECT QUANTITY - Pack Options Grid (3 Cards) */}
      <div className="space-y-2 pt-1">
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          SELECT QUANTITY
        </label>

        <div className="grid grid-cols-3 gap-2.5">
          {availablePacks.map((pack) => {
            const isSelected = selectedPackId === pack.id;
            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => setSelectedPackId(pack.id)}
                className={`relative p-2.5 rounded-xl transition-all text-center flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[#d97706] bg-[#fefcf6] ring-2 ring-[#d97706]/15 shadow-2xs'
                    : 'border border-gray-200 bg-white hover:border-[#d97706]/60'
                }`}
              >
                {/* Floating Badge (e.g. Most Popular) */}
                {pack.badge && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#fbbf24] text-[#78350f] text-[9px] font-bold uppercase px-2 py-0.2 rounded-full border border-[#fde68a] shadow-2xs">
                    {pack.badge}
                  </div>
                )}

                <div className="space-y-0.5">
                  <span className="text-[11px] font-medium text-gray-600 block">{pack.label}</span>
                  <span className="text-base font-bold text-gray-900 font-mono block">
                    ₹{pack.price.toLocaleString()}
                  </span>
                </div>

                {pack.savingsText && (
                  <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">
                    {pack.savingsText}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Urgency Countdown Timer */}
      <div className="flex items-center gap-2 text-red-600 text-xs font-bold pt-1">
        <span>Offer ends in</span>
        <span className="bg-red-50 text-red-700 font-mono px-2 py-0.5 rounded border border-red-200 font-extrabold text-xs">
          {String(timeLeft.hours).padStart(2, '0')} hr : {String(timeLeft.minutes).padStart(2, '0')} min : {String(timeLeft.seconds).padStart(2, '0')} sec
        </span>
      </div>

      {/* Special Offer Collapsible Drawer */}
      <div className="rounded-xl bg-[#fefcf6] border border-[#fde68a] p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#1e293b] text-white font-bold text-xs flex items-center justify-center shrink-0">
              %
            </div>
            <div>
              <h4 className="font-serif font-bold text-xs text-[#0f172a]">
                {product.specialOfferTitle || 'Vaikasi Visakam Special Offer'}
              </h4>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[11px] shrink-0">
            {product.specialOfferDiscount || 'Save ₹500'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowOfferDetails(!showOfferDetails)}
          className="w-full py-1.5 bg-[#fef08a] hover:bg-[#fde047] border border-[#fde68a] text-gray-900 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
        >
          <span>View Offer</span>
          <span className="text-[9px]">{showOfferDetails ? '▲' : '▼'}</span>
        </button>

        {showOfferDetails && (
          <div className="p-2.5 bg-white rounded-lg border border-[#fde68a] text-[11px] text-gray-700 space-y-1 font-sans animate-fadeIn">
            <p className="font-semibold text-[#b45309]">
              {product.specialOfferDetails || 'Use code VAIKASI500 at checkout or automatically applied on orders above ₹1,000!'}
            </p>
            <p className="text-[10px] text-gray-500">Includes free consecration certificate and complimentary Prasad dispatch.</p>
          </div>
        )}
      </div>

      {/* Add to Cart CTA Button (Desktop & Standard Flow) */}
      <div className="pt-1">
        <button
          onClick={handleAddToCart}
          className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.005] cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add {activePack.label} to Shopping Cart</span>
        </button>

        {addedNotice && (
          <div className="mt-2.5 p-2.5 rounded-xl bg-green-50 border border-green-300 text-green-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>{activePack.label} (₹{activePack.price.toLocaleString()}) added to your cart!</span>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="pt-3 border-t border-gray-200 grid grid-cols-2 gap-2.5 text-[11px] text-gray-600 font-medium">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#d97706]" />
          <span>100% Original Govt. Lab Certificate</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-[#d97706]" />
          <span>Pandit Consecrated & Energized</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-[#d97706]" />
          <span>Express Insured Courier Shipping</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#d97706]" />
          <span>Instant WhatsApp Dispatch Alert</span>
        </div>
      </div>

      {/* MOBILE FIXED STICKY ACTION BAR (POSITIONED JUST ABOVE MOBILE BOTTOM NAVBAR) */}
      <div className="fixed bottom-[52px] sm:bottom-14 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-[#fde68a] shadow-[0_-8px_25px_rgba(0,0,0,0.12)] p-2.5 px-3 flex items-center gap-2.5 select-none-mobile pb-safe">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#b45309] font-extrabold text-xs flex items-center justify-center gap-1.5 border border-[#fde68a] app-active-press shadow-2xs cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-[#d97706]" />
          <span>Add to Cart</span>
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md app-active-press cursor-pointer uppercase tracking-wider"
        >
          <Zap className="w-4 h-4 fill-white text-white" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
