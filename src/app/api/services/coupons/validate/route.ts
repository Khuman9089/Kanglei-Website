import { NextRequest, NextResponse } from 'next/server';
import { readPersistentDataAsync } from '@/lib/persistentStore';
import { ServiceCouponScheme } from '../route';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, serviceId, pageTarget, quantity = 1, unitPrice = 0, baseAmount = 0 } = body;

    const allCoupons = await readPersistentDataAsync<ServiceCouponScheme[]>(
      'service_coupons',
      []
    );

    const activeCoupons = allCoupons.filter((c) => c.active);

    let targetCoupon: ServiceCouponScheme | undefined;

    if (code && typeof code === 'string' && code.trim().length > 0) {
      const cleanCode = code.trim().toUpperCase();
      targetCoupon = activeCoupons.find((c) => c.code.toUpperCase() === cleanCode);

      if (!targetCoupon) {
        return NextResponse.json({
          valid: false,
          message: `Coupon code "${cleanCode}" is invalid or expired.`,
        });
      }
    } else {
      // Find eligible auto-apply scheme
      targetCoupon = activeCoupons.find((c) => {
        if (!c.isAutoApply) return false;
        
        // Check target service match
        const matchesService =
          c.targetServices.includes('all') ||
          (serviceId && c.targetServices.includes(serviceId)) ||
          (pageTarget && c.targetServices.includes(pageTarget));

        if (!matchesService) return false;

        // Check quantity threshold
        if (quantity < (c.qualifyingQuantity || 1)) return false;

        return true;
      });
    }

    if (!targetCoupon) {
      return NextResponse.json({
        valid: false,
        message: 'No eligible promotional scheme or coupon found.',
      });
    }

    // Check target service applicability
    const matchesService =
      targetCoupon.targetServices.includes('all') ||
      (serviceId && targetCoupon.targetServices.includes(serviceId)) ||
      (pageTarget && targetCoupon.targetServices.includes(pageTarget));

    if (!matchesService) {
      return NextResponse.json({
        valid: false,
        message: `This coupon is not applicable to the selected astrology service.`,
      });
    }

    // Check usage limits
    if (targetCoupon.usageLimit && targetCoupon.usageCount >= targetCoupon.usageLimit) {
      return NextResponse.json({
        valid: false,
        message: 'This promotional offer has reached its maximum redemption limit.',
      });
    }

    // Check minimum order value
    if (targetCoupon.minOrderValue > 0 && baseAmount < targetCoupon.minOrderValue) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order amount of ₹${targetCoupon.minOrderValue} required for this coupon.`,
      });
    }

    let discountAmount = 0;
    const qty = Math.max(1, Number(quantity) || 1);
    const uPrice = Number(unitPrice) || (baseAmount > 0 ? baseAmount / qty : 499);
    const totalBase = baseAmount > 0 ? Number(baseAmount) : qty * uPrice;

    switch (targetCoupon.schemeType) {
      case 'FIRST_M_OF_N_AT_PRICE': {
        // e.g. Buy 3 Kundlis, 1st is ₹1 and remaining are regular rate
        const qualQty = targetCoupon.qualifyingQuantity || 3;
        const discQty = Math.min(qty, targetCoupon.discountedQuantity || 1);
        const specialPrice = targetCoupon.offerPrice || 1;

        if (qty >= qualQty) {
          // Discount = regular price of discQty - special price of discQty
          discountAmount = Math.max(0, discQty * (uPrice - specialPrice));
        } else {
          return NextResponse.json({
            valid: false,
            message: `Order at least ${qualQty} Kundlis together to unlock this special ₹${specialPrice} offer!`,
            qualifyingQuantity: qualQty,
            currentQuantity: qty,
          });
        }
        break;
      }

      case 'FIRST_N_AT_PRICE': {
        // e.g. First 3 Kundlis for ₹1 total
        const qualQty = targetCoupon.qualifyingQuantity || 3;
        const offerTotal = targetCoupon.offerPrice || 1;

        if (qty >= qualQty) {
          discountAmount = Math.max(0, totalBase - offerTotal);
        } else {
          return NextResponse.json({
            valid: false,
            message: `Add at least ${qualQty} items to qualify for the ₹${offerTotal} special price.`,
            qualifyingQuantity: qualQty,
            currentQuantity: qty,
          });
        }
        break;
      }

      case 'PERCENTAGE': {
        const pct = targetCoupon.discountValue || 0;
        discountAmount = Math.round((totalBase * pct) / 100);
        if (targetCoupon.maxDiscount && discountAmount > targetCoupon.maxDiscount) {
          discountAmount = targetCoupon.maxDiscount;
        }
        break;
      }

      case 'FLAT': {
        const flatVal = targetCoupon.discountValue || 0;
        discountAmount = Math.min(totalBase, flatVal);
        break;
      }

      case 'BUY_X_GET_Y': {
        const qualQty = targetCoupon.qualifyingQuantity || 2;
        const freeQty = targetCoupon.discountedQuantity || 1;
        if (qty >= qualQty + freeQty) {
          discountAmount = freeQty * uPrice;
        } else {
          return NextResponse.json({
            valid: false,
            message: `Add at least ${qualQty + freeQty} items to get ${freeQty} free!`,
          });
        }
        break;
      }

      default:
        discountAmount = 0;
    }

    const finalAmount = Math.max(0, totalBase - discountAmount);

    return NextResponse.json({
      valid: true,
      message: `🎉 Offer Applied: ${targetCoupon.title}! You saved ₹${discountAmount}.`,
      discountAmount,
      finalAmount,
      appliedScheme: targetCoupon,
    });
  } catch (error) {
    console.error('Error validating coupon scheme:', error);
    return NextResponse.json(
      { valid: false, message: 'Internal error validating promotional scheme' },
      { status: 500 }
    );
  }
}
