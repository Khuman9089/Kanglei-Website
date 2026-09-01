import { NextResponse } from 'next/server';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export interface CouponItem {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FLAT' | 'FREE_SHIPPING';
  value: number; // e.g. 20 for 20% OFF or 100 for ₹100 OFF
  minOrderAmount: number;
  active: boolean;
  expiryDate?: string;
  usageCount: number;
}

const DEFAULT_COUPONS: CouponItem[] = [
  { id: 'c-1', code: 'KANGLEI20', type: 'PERCENTAGE', value: 20, minOrderAmount: 499, active: true, usageCount: 42 },
  { id: 'c-2', code: 'ASTRO100', type: 'FLAT', value: 100, minOrderAmount: 999, active: true, usageCount: 19 },
  { id: 'c-3', code: 'FREESHIP', type: 'FREE_SHIPPING', value: 0, minOrderAmount: 299, active: true, usageCount: 88 },
];

export async function GET() {
  const coupons = await readPersistentDataAsync<CouponItem[]>('shop_coupons', DEFAULT_COUPONS);
  return NextResponse.json({ coupons });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let coupons = await readPersistentDataAsync<CouponItem[]>('shop_coupons', DEFAULT_COUPONS);

    if (body.action === 'VALIDATE') {
      const inputCode = (body.code || '').trim().toUpperCase();
      const subtotal = Number(body.subtotal) || 0;

      const found = coupons.find((c) => c.code.toUpperCase() === inputCode && c.active !== false);

      if (!found) {
        return NextResponse.json({ valid: false, message: 'Invalid or expired coupon code.' }, { status: 400 });
      }

      if (subtotal < found.minOrderAmount) {
        return NextResponse.json({
          valid: false,
          message: `Minimum order amount of ₹${found.minOrderAmount} required for coupon ${found.code}.`,
        }, { status: 400 });
      }

      let discountAmount = 0;
      let freeShipping = false;

      if (found.type === 'PERCENTAGE') {
        discountAmount = Math.round((subtotal * found.value) / 100);
      } else if (found.type === 'FLAT') {
        discountAmount = Math.min(subtotal, found.value);
      } else if (found.type === 'FREE_SHIPPING') {
        freeShipping = true;
      }

      return NextResponse.json({
        valid: true,
        message: `Coupon "${found.code}" applied successfully!`,
        coupon: found,
        discountAmount,
        freeShipping,
      });
    }

    if (body.action === 'CREATE_COUPON' || body.action === 'UPDATE_COUPON') {
      const coupon: CouponItem = body.coupon;
      coupon.code = coupon.code.toUpperCase().trim();
      const idx = coupons.findIndex((c) => c.id === coupon.id);
      if (idx >= 0) {
        coupons[idx] = { ...coupons[idx], ...coupon };
      } else {
        coupons.unshift(coupon);
      }
      await writePersistentDataAsync<CouponItem[]>('shop_coupons', coupons);
      return NextResponse.json({ success: true, message: `Coupon ${coupon.code} saved!`, coupons });
    }

    if (body.action === 'DELETE_COUPON') {
      coupons = coupons.filter((c) => c.id !== body.id);
      await writePersistentDataAsync<CouponItem[]>('shop_coupons', coupons);
      return NextResponse.json({ success: true, message: 'Coupon deleted!', coupons });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
