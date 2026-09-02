import { NextResponse } from 'next/server';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images?: string[];
  badge: string;
  stock: number;
  description: string;
  features: string[];
  variants?: ProductVariant[];
  vedicSignificance?: string;
  wearingRituals?: string;
  // Astrologer Seller Marketplace Fields
  sellerType?: 'PLATFORM' | 'ASTROLOGER';
  sellerId?: string;
  sellerName?: string;
  status?: 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED';
  adminCommissionPct?: number;
  isFeatured?: boolean;
}

export interface ShopOrder {
  id: string;
  orderRef: string;
  buyerName: string;
  mobile: string;
  whatsappNo: string;
  address: string;
  pincode: string;
  items: {
    productId: string;
    variantId?: string;
    variantName?: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
    sellerType?: 'PLATFORM' | 'ASTROLOGER';
    sellerId?: string;
    sellerName?: string;
    adminCommissionPct?: number;
    adminCommissionAmount?: number;
    astroPayoutAmount?: number;
  }[];
  subtotalAmount?: number;
  discountAmount?: number;
  couponCode?: string;
  shippingFee?: number;
  totalAmount: number;
  utr: string;
  status: 'PAYMENT_PENDING' | 'PAID' | 'ENERGIZING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  adminConfirmed?: boolean;
  orderedAt: string;
  // Delivery Logistics
  courierPartner?: string;
  trackingNumber?: string;
  deliveryAgentPhone?: string;
  expectedDeliveryDate?: string;
  dispatchedAt?: string;
}

export interface ShopSliderItem {
  id: string;
  badge: string;
  title: string;
  highlightText: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  bgColor?: string;
  active: boolean;
  displayOrder: number;
  price?: string;
  originalPrice?: string;
  rating?: number;
}

const DEFAULT_CATEGORIES: string[] = ['Gemstones', 'Astrology Books', 'Yantras & Mala', 'Puja Items', 'Consecrated Remedies'];

const DEFAULT_COMMISSION_SETTINGS = {
  defaultCommissionPct: 15,
};

const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    title: 'Natural Ceylon Yellow Sapphire (Pukhraj) 5.25 Ratti',
    category: 'Gemstones',
    price: 6999,
    originalPrice: 8999,
    rating: 4.9,
    reviewsCount: 84,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    badge: 'Lab Certified 100% Original',
    stock: 8,
    description: 'Unheated and untreated natural Ceylon Yellow Sapphire for Jupiter (Guru) strengthening, career promotions, and spiritual wisdom.',
    features: [
      'Govt. Lab Tested Certificate Included',
      'Purified with Vedic Mantras & Panchamrut',
      'Ideal for Dhan (Wealth) & Vidya (Education) Yogas',
    ],
    sellerType: 'ASTROLOGER',
    sellerId: 'astro-1',
    sellerName: 'Acharya Tombi Sharma',
    status: 'APPROVED',
    adminCommissionPct: 15,
  },
  {
    id: 'prod-2',
    title: 'Energized Heavy Brass Shri Yantra (3x3 inch)',
    category: 'Yantras & Mala',
    price: 1299,
    originalPrice: 1999,
    rating: 4.8,
    reviewsCount: 62,
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=800&auto=format&fit=crop',
    badge: 'Pandit Blessed',
    stock: 15,
    description: 'Authentic 3D Brass Shri Yantra for home altar & cash locker. Attracts Mahalakshmi grace, removes Vastu Dosh, and enhances business prosperity.',
    features: [
      'Pure heavy brass material',
      'Pran Pratishthed by Vedic Priests',
      'Brings financial stability & harmony',
    ],
    sellerType: 'PLATFORM',
    sellerId: 'platform-admin',
    sellerName: 'KangleiAstro Store',
    status: 'APPROVED',
    adminCommissionPct: 0,
  },
  {
    id: 'prod-5',
    title: 'Natural 5 Mukhi Nepal Rudraksha Mala (108+1 Beads)',
    category: 'Yantras & Mala',
    price: 999,
    originalPrice: 1499,
    rating: 4.9,
    reviewsCount: 140,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=800&auto=format&fit=crop',
    badge: 'Original Nepalese Beads',
    stock: 30,
    description: 'Authentic 5 Mukhi Nepal Rudraksha rosary for meditation, mental calm, blood pressure balance, and Lord Shiva protection.',
    features: [
      '108+1 High quality Nepali Rudraksha beads',
      'Includes testing certificate & silk pouch',
      'Purified with Panchamrut Puja',
    ],
    sellerType: 'PLATFORM',
    sellerId: 'platform-admin',
    sellerName: 'KangleiAstro Store',
    status: 'APPROVED',
    adminCommissionPct: 0,
  },
];

const DEFAULT_SHOP_SLIDERS: ShopSliderItem[] = [
  {
    id: 'slider-1',
    badge: '✨ AUTHENTIC MANIPURI & VEDIC CONSECRATED STORE',
    title: 'Sacred Vedic Remedies &',
    highlightText: 'Lab-Certified Gemstones',
    subtitle: 'Explore 100% genuine Ceylon Yellow Sapphires, traditional Kuthi reading books, 24k gold Shree Yantras, and Nepali Rudraksha beads consecrated by Master Pandits.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    ctaText: 'Shop Consecrated Gemstones',
    ctaLink: '/shop',
    bgColor: 'from-[#0b132b] via-[#1c2541] to-[#0b132b]',
    active: true,
    displayOrder: 1,
  },
  {
    id: 'slider-2',
    badge: '📜 TRADITIONAL MANIPURI SCRIPTURES & KUTHI BOOKS',
    title: 'Authentic Meitei Astrology',
    highlightText: 'Kuthi Reading Books & Scriptures',
    subtitle: 'Discover handwritten and printed Manipuri Meitei Puya, Jyotish books, and astrological guides directly from Kangleipak scholars.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    ctaText: 'Explore Astrological Scriptures',
    ctaLink: '/shop?category=Astrology%20Books',
    bgColor: 'from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]',
    active: true,
    displayOrder: 2,
  },
  {
    id: 'slider-3',
    badge: '📿 ENERGIZED SPIRITUAL MALA & YANTRAS',
    title: 'Pandit Blessed 24K Gold',
    highlightText: 'Shree Yantras & Nepal Rudraksha',
    subtitle: 'Attract Mahalakshmi grace, remove home Vastu Dosh, and bring long-term financial stability with lab-certified consecrated items.',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=800&auto=format&fit=crop',
    ctaText: 'Buy Energized Yantras',
    ctaLink: '/shop?category=Yantras%20%26%20Mala',
    bgColor: 'from-[#14532d] via-[#166534] to-[#064e3b]',
    active: true,
    displayOrder: 3,
  },
];

const DEFAULT_SHOP_ORDERS: ShopOrder[] = [];

export async function GET() {
  const products = await readPersistentDataAsync<ProductItem[]>('shop_products', DEFAULT_PRODUCTS);
  const orders = await readPersistentDataAsync<ShopOrder[]>('shop_orders', DEFAULT_SHOP_ORDERS);
  const categories = await readPersistentDataAsync<string[]>('shop_categories', DEFAULT_CATEGORIES);
  const commissionSettings = await readPersistentDataAsync('shop_commission', DEFAULT_COMMISSION_SETTINGS);
  const sliders = await readPersistentDataAsync<ShopSliderItem[]>('shop_sliders', DEFAULT_SHOP_SLIDERS);

  return NextResponse.json({
    products,
    orders,
    categories,
    commissionSettings,
    sliders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let products = await readPersistentDataAsync<ProductItem[]>('shop_products', DEFAULT_PRODUCTS);
    let orders = await readPersistentDataAsync<ShopOrder[]>('shop_orders', DEFAULT_SHOP_ORDERS);
    let categories = await readPersistentDataAsync<string[]>('shop_categories', DEFAULT_CATEGORIES);
    let commissionSettings = await readPersistentDataAsync('shop_commission', DEFAULT_COMMISSION_SETTINGS);
    let sliders = await readPersistentDataAsync<ShopSliderItem[]>('shop_sliders', DEFAULT_SHOP_SLIDERS);

    if (body.action === 'UPDATE_COMMISSION') {
      if (typeof body.defaultCommissionPct === 'number') {
        commissionSettings.defaultCommissionPct = body.defaultCommissionPct;
        await writePersistentDataAsync('shop_commission', commissionSettings);
      }
      return NextResponse.json({
        success: true,
        message: `Platform Commission Rate updated to ${commissionSettings.defaultCommissionPct}%!`,
        commissionSettings,
      });
    }

    // SLIDER ACTIONS
    if (body.action === 'CREATE_SLIDER' || body.action === 'UPDATE_SLIDER' || body.action === 'SAVE_SLIDER') {
      const slider: ShopSliderItem = body.slider;
      const idx = sliders.findIndex((s) => s.id === slider.id);
      if (idx >= 0) {
        sliders[idx] = { ...sliders[idx], ...slider };
      } else {
        sliders.push({
          ...slider,
          id: slider.id || 'slider-' + Date.now(),
          displayOrder: sliders.length + 1,
        });
      }
      await writePersistentDataAsync('shop_sliders', sliders);
      return NextResponse.json({ success: true, message: 'Shop Banner Slider saved live!', sliders });
    }

    if (body.action === 'TOGGLE_SLIDER') {
      const idx = sliders.findIndex((s) => s.id === body.id);
      if (idx >= 0) {
        sliders[idx].active = !sliders[idx].active;
        await writePersistentDataAsync('shop_sliders', sliders);
      }
      return NextResponse.json({ success: true, message: 'Slider status toggled!', sliders });
    }

    if (body.action === 'DELETE_SLIDER') {
      sliders = sliders.filter((s) => s.id !== body.id);
      await writePersistentDataAsync('shop_sliders', sliders);
      return NextResponse.json({ success: true, message: 'Slider banner deleted!', sliders });
    }

    if (body.action === 'CREATE_CATEGORY') {
      const catName = (body.category || '').trim();
      if (catName && !categories.includes(catName)) {
        categories.push(catName);
        await writePersistentDataAsync('shop_categories', categories);
      }
      return NextResponse.json({ success: true, message: 'Category added live!', categories });
    }

    if (body.action === 'DELETE_CATEGORY') {
      categories = categories.filter((c: string) => c !== body.category);
      await writePersistentDataAsync('shop_categories', categories);
      return NextResponse.json({ success: true, message: 'Category deleted!', categories });
    }

    if (body.action === 'CREATE_PRODUCT' || body.action === 'UPDATE_PRODUCT' || body.action === 'SAVE_PRODUCT') {
      const prod: ProductItem = body.product;
      if (prod.sellerType === 'ASTROLOGER' && !prod.status) {
        prod.status = 'PENDING_APPROVAL';
        prod.adminCommissionPct = commissionSettings.defaultCommissionPct;
      } else if (!prod.status) {
        prod.status = 'APPROVED';
        prod.adminCommissionPct = 0;
      }

      if (prod.category && !categories.includes(prod.category)) {
        categories.push(prod.category);
        await writePersistentDataAsync('shop_categories', categories);
      }

      const idx = products.findIndex((p: ProductItem) => p.id === prod.id);
      if (idx >= 0) {
        products[idx] = { ...products[idx], ...prod };
      } else {
        products.unshift(prod);
      }
      await writePersistentDataAsync('shop_products', products);

      return NextResponse.json({
        success: true,
        message: prod.status === 'PENDING_APPROVAL' ? 'Product submitted for Admin approval!' : 'Product saved & published!',
        products,
        categories,
      });
    }

    if (body.action === 'APPROVE_PRODUCT') {
      const p = products.find((item: ProductItem) => item.id === body.id);
      if (p) {
        p.status = 'APPROVED';
        if (typeof body.adminCommissionPct === 'number') {
          p.adminCommissionPct = body.adminCommissionPct;
        }
        await writePersistentDataAsync('shop_products', products);
      }
      return NextResponse.json({ success: true, message: 'Astrologer Product approved & published live to E-Store!', products });
    }

    if (body.action === 'REJECT_PRODUCT') {
      const p = products.find((item: ProductItem) => item.id === body.id);
      if (p) {
        p.status = 'REJECTED';
        await writePersistentDataAsync('shop_products', products);
      }
      return NextResponse.json({ success: true, message: 'Astrologer Product submission rejected.', products });
    }

    if (body.action === 'UPDATE_PRODUCT_COMMISSION') {
      const p = products.find((item: ProductItem) => item.id === body.id);
      if (p && typeof body.adminCommissionPct === 'number') {
        p.adminCommissionPct = body.adminCommissionPct;
        await writePersistentDataAsync('shop_products', products);
      }
      return NextResponse.json({ success: true, message: 'Custom commission updated for product!', products });
    }

    if (body.action === 'TOGGLE_FEATURED_PRODUCT') {
      const p = products.find((item: ProductItem) => item.id === body.id);
      if (p) {
        p.isFeatured = !p.isFeatured;
        await writePersistentDataAsync('shop_products', products);
      }
      return NextResponse.json({ success: true, message: 'Homepage featured status toggled!', products });
    }

    if (body.action === 'DELETE_PRODUCT') {
      products = products.filter((p: ProductItem) => p.id !== body.id);
      await writePersistentDataAsync('shop_products', products);
      return NextResponse.json({ success: true, message: 'Product deleted!', products, categories });
    }

    if (body.action === 'PLACE_ORDER') {
      const enrichedItems = body.items.map((it: any) => {
        const prod = products.find((p: ProductItem) => p.id === it.productId);
        const commPct = prod?.sellerType === 'ASTROLOGER' ? (prod.adminCommissionPct ?? commissionSettings.defaultCommissionPct) : 0;
        const totalItemPrice = it.price * it.quantity;
        const commAmt = Math.round((totalItemPrice * commPct) / 100);
        const astroPayout = totalItemPrice - commAmt;

        return {
          ...it,
          sellerType: prod?.sellerType || 'PLATFORM',
          sellerId: prod?.sellerId || 'platform-admin',
          sellerName: prod?.sellerName || 'KangleiAstro Store',
          adminCommissionPct: commPct,
          adminCommissionAmount: commAmt,
          astroPayoutAmount: astroPayout,
        };
      });

      const newOrder: ShopOrder = {
        id: 'order-s' + Date.now(),
        orderRef: 'ESTORE-2026-' + Math.floor(100 + Math.random() * 900),
        buyerName: body.buyerName,
        mobile: body.mobile,
        whatsappNo: body.whatsappNo || body.mobile,
        address: body.address,
        pincode: body.pincode,
        items: enrichedItems,
        subtotalAmount: body.subtotalAmount || body.totalAmount,
        discountAmount: body.discountAmount || 0,
        couponCode: body.couponCode || '',
        shippingFee: body.shippingFee || 0,
        totalAmount: body.totalAmount,
        utr: body.utr,
        status: 'PAID',
        adminConfirmed: false,
        orderedAt: 'Just Now',
      };
      orders.unshift(newOrder);
      await writePersistentDataAsync('shop_orders', orders);

      // Deduct product and variant stock
      body.items.forEach((item: any) => {
        const p = products.find((sp: ProductItem) => sp.id === item.productId);
        if (p) {
          p.stock = Math.max(0, p.stock - item.quantity);
          if (item.variantId && Array.isArray(p.variants)) {
            const v = p.variants.find((vrt: ProductVariant) => vrt.id === item.variantId);
            if (v) v.stock = Math.max(0, v.stock - item.quantity);
          }
        }
      });
      await writePersistentDataAsync('shop_products', products);

      return NextResponse.json({ success: true, message: 'Shop order placed successfully!', order: newOrder, categories });
    }

    if (body.action === 'CONFIRM_ASTRO_ORDER') {
      const order = orders.find((o: ShopOrder) => o.id === body.id);
      if (order) {
        order.adminConfirmed = true;
        await writePersistentDataAsync('shop_orders', orders);
      }
      return NextResponse.json({ success: true, message: 'Astrologer order confirmed by Admin & payout credited!', orders });
    }

    if (body.action === 'UPDATE_ORDER_STATUS') {
      const order = orders.find((o: ShopOrder) => o.id === body.id);
      if (order) {
        order.status = body.status;
        await writePersistentDataAsync('shop_orders', orders);
      }
      return NextResponse.json({ success: true, orders, categories });
    }

    if (body.action === 'ASSIGN_DELIVERY') {
      const order = orders.find((o: ShopOrder) => o.id === body.id);
      if (order) {
        order.courierPartner = body.courierPartner || 'BlueDart Express';
        order.trackingNumber = body.trackingNumber || 'BD-' + Math.floor(10000000 + Math.random() * 90000000) + 'IN';
        order.deliveryAgentPhone = body.deliveryAgentPhone || '+91 98620 11223';
        order.expectedDeliveryDate = body.expectedDeliveryDate || '2026-08-30';
        order.status = 'DISPATCHED';
        order.dispatchedAt = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        await writePersistentDataAsync('shop_orders', orders);
      }
      return NextResponse.json({ success: true, message: 'Delivery assigned & order marked DISPATCHED!', orders, categories });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
