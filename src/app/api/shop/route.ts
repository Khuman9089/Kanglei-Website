import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export interface ProductItem {
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
    title: string;
    price: number;
    quantity: number;
    sellerType?: 'PLATFORM' | 'ASTROLOGER';
    sellerId?: string;
    sellerName?: string;
    adminCommissionPct?: number;
    adminCommissionAmount?: number;
    astroPayoutAmount?: number;
  }[];
  totalAmount: number;
  utr: string;
  status: 'PAYMENT_PENDING' | 'PAID' | 'DISPATCHED' | 'DELIVERED';
  adminConfirmed?: boolean;
  orderedAt: string;
  // Delivery Logistics
  courierPartner?: string;
  trackingNumber?: string;
  deliveryAgentPhone?: string;
  expectedDeliveryDate?: string;
  dispatchedAt?: string;
}

let storedCategories: string[] = ['Gemstones', 'Astrology Books', 'Yantras & Mala', 'Puja Items', 'Consecrated Remedies'];

let storedCommissionSettings = {
  defaultCommissionPct: 15, // Default 15% platform commission on astrologer vendor sales
};

let storedProducts: ProductItem[] = [
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
      'Unheated & Untreated Natural Gemstone',
      'Energized with Vedic Mantras before dispatch',
    ],
    sellerType: 'PLATFORM',
    sellerId: 'platform-admin',
    sellerName: 'KangleiAstro Store',
    status: 'APPROVED',
    adminCommissionPct: 0,
  },
  {
    id: 'prod-2',
    title: 'Brihat Parashara Hora Shastra (2-Volume Deluxe Hardcover Set)',
    category: 'Astrology Books',
    price: 1499,
    originalPrice: 1999,
    rating: 5.0,
    reviewsCount: 120,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    badge: 'Classic Vedic Scripture',
    stock: 25,
    description: 'The foundational encyclopedic text of Vedic astrology authored by Sage Parashara with Sanskrit shlokas and English translations.',
    features: [
      'Complete 2-Volume Hardcover Collector Edition',
      'Detailed planetary Yogas, Dashas, & remedies',
      'Sanskrit text with word-by-word commentary',
    ],
    sellerType: 'PLATFORM',
    sellerId: 'platform-admin',
    sellerName: 'KangleiAstro Store',
    status: 'APPROVED',
    adminCommissionPct: 0,
  },
  {
    id: 'prod-3',
    title: 'Traditional Manipuri Kuthi Yengba Guide & Panchang Reader',
    category: 'Astrology Books',
    price: 799,
    originalPrice: 999,
    rating: 4.8,
    reviewsCount: 62,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
    badge: 'Regional Vedic Guide',
    stock: 40,
    description: 'Comprehensive guidebook detailing traditional Manipuri Kuthi chart calculation, Meitei horoscope symbols, and planetary remedies.',
    features: [
      'Step-by-step Kuthi paper calculation methodology',
      'Meitei astrological terminology explained',
      'Includes 2026-2027 transit tables',
    ],
    sellerType: 'PLATFORM',
    sellerId: 'platform-admin',
    sellerName: 'KangleiAstro Store',
    status: 'APPROVED',
    adminCommissionPct: 0,
  },
  {
    id: 'prod-4',
    title: 'Sacred 24k Gold Plated Shree Yantra (3D Meru)',
    category: 'Yantras & Mala',
    price: 2499,
    originalPrice: 3200,
    rating: 4.9,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    badge: 'Energized Heavy Brass',
    stock: 12,
    description: 'Authentic 3D Meru Shree Yantra crafted in heavy brass with 24k gold foil plating for financial abundance and house Vaastu harmony.',
    features: [
      '3D Pyramid Meru Sacred Geometry',
      '24k Gold foil electroplating',
      'Consecrated by Master Pandits',
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
  {
    id: 'prod-6',
    title: 'Consecrated Parad (Mercury) Shivlinga 150g',
    category: 'Consecrated Remedies',
    price: 1899,
    originalPrice: 2499,
    rating: 5.0,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1545232979-fbfd42e000b5?q=80&w=800&auto=format&fit=crop',
    badge: 'Pandit Consecrated',
    stock: 6,
    description: 'Purified 8-stage Samskara Parad (Mercury) Shivlinga for Kundali Dosh Nivaran & house peace consecrated personally by Acharya Tombi.',
    features: [
      'Authentic 8-Stage Purified Parad',
      'Consecrated at Mahadev Puja Altars',
      'Removes Rahu-Ketu & Graha Dosha',
    ],
    sellerType: 'ASTROLOGER',
    sellerId: 'astro-1',
    sellerName: 'Acharya Tombi Sharma',
    status: 'APPROVED',
    adminCommissionPct: 15,
  },
];

let storedShopOrders: ShopOrder[] = [
  {
    id: 'order-s1',
    orderRef: 'ESTORE-2026-901',
    buyerName: 'Khamba Singh',
    mobile: '+91 98620 44120',
    whatsappNo: '+91 98620 44120',
    address: 'House No 42, Keishampat Leikai, Imphal West',
    pincode: '795001',
    items: [
      {
        productId: 'prod-[#6]',
        title: 'Consecrated Parad (Mercury) Shivlinga 150g',
        price: 1899,
        quantity: 1,
        sellerType: 'ASTROLOGER',
        sellerId: 'astro-1',
        sellerName: 'Acharya Tombi Sharma',
        adminCommissionPct: 15,
        adminCommissionAmount: 285,
        astroPayoutAmount: 1614,
      },
    ],
    totalAmount: 1899,
    utr: '429810998120',
    status: 'DISPATCHED',
    adminConfirmed: true,
    orderedAt: 'Today, 11:30 AM',
    courierPartner: 'BlueDart Express',
    trackingNumber: 'BD-98401928IN',
    deliveryAgentPhone: '+91 98620 11223',
    expectedDeliveryDate: '2026-08-30',
    dispatchedAt: 'Today, 02:15 PM',
  },
];

export async function GET() {
  return NextResponse.json({
    products: storedProducts,
    orders: storedShopOrders,
    categories: storedCategories,
    commissionSettings: storedCommissionSettings,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === 'UPDATE_COMMISSION') {
      if (typeof body.defaultCommissionPct === 'number') {
        storedCommissionSettings.defaultCommissionPct = body.defaultCommissionPct;
      }
      return NextResponse.json({
        success: true,
        message: `Platform Commission Rate updated to ${storedCommissionSettings.defaultCommissionPct}%!`,
        commissionSettings: storedCommissionSettings,
      });
    }

    if (body.action === 'CREATE_CATEGORY') {
      const catName = (body.category || '').trim();
      if (catName && !storedCategories.includes(catName)) {
        storedCategories.push(catName);
      }
      return NextResponse.json({ success: true, message: 'Category added live!', categories: storedCategories });
    }

    if (body.action === 'DELETE_CATEGORY') {
      storedCategories = storedCategories.filter((c) => c !== body.category);
      return NextResponse.json({ success: true, message: 'Category deleted!', categories: storedCategories });
    }

    if (body.action === 'CREATE_PRODUCT' || body.action === 'UPDATE_PRODUCT') {
      const prod: ProductItem = body.product;
      // If submitted by Astrologer, set status to PENDING_APPROVAL unless Admin explicitly approves it
      if (prod.sellerType === 'ASTROLOGER' && !prod.status) {
        prod.status = 'PENDING_APPROVAL';
        prod.adminCommissionPct = storedCommissionSettings.defaultCommissionPct;
      } else if (!prod.status) {
        prod.status = 'APPROVED';
        prod.adminCommissionPct = 0;
      }

      if (prod.category && !storedCategories.includes(prod.category)) {
        storedCategories.push(prod.category);
      }

      const idx = storedProducts.findIndex((p) => p.id === prod.id);
      if (idx >= 0) {
        storedProducts[idx] = { ...storedProducts[idx], ...prod };
      } else {
        storedProducts.unshift(prod);
      }

      return NextResponse.json({
        success: true,
        message: prod.status === 'PENDING_APPROVAL' ? 'Product submitted for Admin approval!' : 'Product saved & published!',
        products: storedProducts,
        categories: storedCategories,
      });
    }

    if (body.action === 'APPROVE_PRODUCT') {
      const p = storedProducts.find((item) => item.id === body.id);
      if (p) {
        p.status = 'APPROVED';
        if (typeof body.adminCommissionPct === 'number') {
          p.adminCommissionPct = body.adminCommissionPct;
        }
      }
      return NextResponse.json({ success: true, message: 'Astrologer Product approved & published live to E-Store!', products: storedProducts });
    }

    if (body.action === 'REJECT_PRODUCT') {
      const p = storedProducts.find((item) => item.id === body.id);
      if (p) {
        p.status = 'REJECTED';
      }
      return NextResponse.json({ success: true, message: 'Astrologer Product submission rejected.', products: storedProducts });
    }

    if (body.action === 'UPDATE_PRODUCT_COMMISSION') {
      const p = storedProducts.find((item) => item.id === body.id);
      if (p && typeof body.adminCommissionPct === 'number') {
        p.adminCommissionPct = body.adminCommissionPct;
      }
      return NextResponse.json({ success: true, message: 'Custom commission updated for product!', products: storedProducts });
    }

    if (body.action === 'TOGGLE_FEATURED_PRODUCT') {
      const p = storedProducts.find((item) => item.id === body.id);
      if (p) {
        p.isFeatured = !p.isFeatured;
      }
      return NextResponse.json({ success: true, message: 'Homepage featured status toggled!', products: storedProducts });
    }

    if (body.action === 'DELETE_PRODUCT') {
      storedProducts = storedProducts.filter((p) => p.id !== body.id);
      return NextResponse.json({ success: true, message: 'Product deleted!', products: storedProducts, categories: storedCategories });
    }

    if (body.action === 'PLACE_ORDER') {
      const enrichedItems = body.items.map((it: any) => {
        const prod = storedProducts.find((p) => p.id === it.productId);
        const commPct = prod?.sellerType === 'ASTROLOGER' ? (prod.adminCommissionPct ?? storedCommissionSettings.defaultCommissionPct) : 0;
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
        totalAmount: body.totalAmount,
        utr: body.utr,
        status: 'PAID',
        adminConfirmed: false,
        orderedAt: 'Just Now',
      };
      storedShopOrders.unshift(newOrder);

      // Deduct stock
      body.items.forEach((item: any) => {
        const p = storedProducts.find((sp) => sp.id === item.productId);
        if (p) p.stock = Math.max(0, p.stock - item.quantity);
      });

      return NextResponse.json({ success: true, message: 'Shop order placed successfully!', order: newOrder, categories: storedCategories });
    }

    if (body.action === 'CONFIRM_ASTRO_ORDER') {
      const order = storedShopOrders.find((o) => o.id === body.id);
      if (order) {
        order.adminConfirmed = true;
      }
      return NextResponse.json({ success: true, message: 'Astrologer order confirmed by Admin & payout credited!', orders: storedShopOrders });
    }

    if (body.action === 'UPDATE_ORDER_STATUS') {
      const order = storedShopOrders.find((o) => o.id === body.id);
      if (order) {
        order.status = body.status;
      }
      return NextResponse.json({ success: true, orders: storedShopOrders, categories: storedCategories });
    }

    if (body.action === 'ASSIGN_DELIVERY') {
      const order = storedShopOrders.find((o) => o.id === body.id);
      if (order) {
        order.courierPartner = body.courierPartner || 'BlueDart Express';
        order.trackingNumber = body.trackingNumber || 'BD-' + Math.floor(10000000 + Math.random() * 90000000) + 'IN';
        order.deliveryAgentPhone = body.deliveryAgentPhone || '+91 98620 11223';
        order.expectedDeliveryDate = body.expectedDeliveryDate || '2026-08-30';
        order.status = 'DISPATCHED';
        order.dispatchedAt = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return NextResponse.json({ success: true, message: 'Delivery assigned & order marked DISPATCHED!', orders: storedShopOrders, categories: storedCategories });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
