import { NextRequest, NextResponse } from 'next/server';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export interface ServiceCouponScheme {
  id: string;
  code: string;
  title: string;
  description: string;
  schemeType: 'FIRST_M_OF_N_AT_PRICE' | 'FIRST_N_AT_PRICE' | 'PERCENTAGE' | 'FLAT' | 'BUY_X_GET_Y';
  targetServices: string[];
  qualifyingQuantity: number;
  discountedQuantity: number;
  offerPrice: number;
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  isAutoApply: boolean;
  showBanner: boolean;
  badgeText?: string;
  active: boolean;
  usageLimit?: number;
  usageCount: number;
  createdAt: string;
}

const DEFAULT_SERVICE_COUPONS: ServiceCouponScheme[] = [
  {
    id: 'sc-1',
    code: '3KUNDLI1',
    title: '3 Kundli Special Scheme (1st at ₹1)',
    description: 'Order 3 Kundlis together — 1st Kundli at ₹1 only, rest at regular service rate!',
    schemeType: 'FIRST_M_OF_N_AT_PRICE',
    targetServices: ['all', 's-1', '/manipuri_kuthi_yengba', '/manipuri_kuthi'],
    qualifyingQuantity: 3,
    discountedQuantity: 1,
    offerPrice: 1,
    discountValue: 0,
    minOrderValue: 0,
    isAutoApply: true,
    showBanner: true,
    badgeText: '⚡ 1ST KUNDLI AT ₹1',
    active: true,
    usageLimit: 5000,
    usageCount: 14,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sc-2',
    code: 'VEDIC20',
    title: 'Special Vedic Discount: 20% Off',
    description: 'Get 20% flat discount on all Vedic astrology readings and Kuthi creation services.',
    schemeType: 'PERCENTAGE',
    targetServices: ['all'],
    qualifyingQuantity: 1,
    discountedQuantity: 1,
    offerPrice: 0,
    discountValue: 20,
    minOrderValue: 499,
    isAutoApply: false,
    showBanner: true,
    badgeText: '🎉 20% OFF',
    active: true,
    usageLimit: 1000,
    usageCount: 38,
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublicOnly = searchParams.get('public') === 'true';

    const coupons = await readPersistentDataAsync<ServiceCouponScheme[]>(
      'service_coupons',
      DEFAULT_SERVICE_COUPONS
    );

    if (isPublicOnly) {
      return NextResponse.json({
        success: true,
        coupons: coupons.filter((c) => c.active),
      });
    }

    return NextResponse.json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.error('Error fetching service coupons:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service coupons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let currentCoupons = await readPersistentDataAsync<ServiceCouponScheme[]>(
      'service_coupons',
      DEFAULT_SERVICE_COUPONS
    );

    // If a full array of coupons is passed, replace and persist
    if (Array.isArray(body.coupons)) {
      currentCoupons = body.coupons;
      await writePersistentDataAsync('service_coupons', currentCoupons);
      return NextResponse.json({
        success: true,
        message: 'Service coupons updated successfully',
        coupons: currentCoupons,
      });
    }

    // Otherwise, create or update a single coupon item
    const couponItem: ServiceCouponScheme = {
      id: body.id || `sc-${Date.now()}`,
      code: (body.code || '').trim().toUpperCase(),
      title: body.title || 'Special Service Offer',
      description: body.description || '',
      schemeType: body.schemeType || 'FIRST_M_OF_N_AT_PRICE',
      targetServices: Array.isArray(body.targetServices) && body.targetServices.length > 0 ? body.targetServices : ['all'],
      qualifyingQuantity: Number(body.qualifyingQuantity) || 1,
      discountedQuantity: Number(body.discountedQuantity) || 1,
      offerPrice: Number(body.offerPrice) || 0,
      discountValue: Number(body.discountValue) || 0,
      minOrderValue: Number(body.minOrderValue) || 0,
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : undefined,
      isAutoApply: Boolean(body.isAutoApply),
      showBanner: Boolean(body.showBanner),
      badgeText: body.badgeText || '',
      active: body.active !== undefined ? Boolean(body.active) : true,
      usageLimit: body.usageLimit ? Number(body.usageLimit) : undefined,
      usageCount: Number(body.usageCount) || 0,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const existingIndex = currentCoupons.findIndex((c) => c.id === couponItem.id);
    if (existingIndex >= 0) {
      currentCoupons[existingIndex] = couponItem;
    } else {
      currentCoupons.unshift(couponItem);
    }

    await writePersistentDataAsync('service_coupons', currentCoupons);

    return NextResponse.json({
      success: true,
      message: 'Service coupon saved successfully',
      coupon: couponItem,
      coupons: currentCoupons,
    });
  } catch (error) {
    console.error('Error saving service coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save service coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing coupon ID' }, { status: 400 });
    }

    let currentCoupons = await readPersistentDataAsync<ServiceCouponScheme[]>(
      'service_coupons',
      DEFAULT_SERVICE_COUPONS
    );

    currentCoupons = currentCoupons.filter((c) => c.id !== id);
    await writePersistentDataAsync('service_coupons', currentCoupons);

    return NextResponse.json({
      success: true,
      message: 'Service coupon deleted successfully',
      coupons: currentCoupons,
    });
  } catch (error) {
    console.error('Error deleting service coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete service coupon' },
      { status: 500 }
    );
  }
}
