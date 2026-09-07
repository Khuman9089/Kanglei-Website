import { NextResponse } from 'next/server';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export interface ShopReturnRequest {
  id: string;
  orderRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  productTitle: string;
  requestType: 'REPLACEMENT' | 'REFUND';
  reason: 'WRONG_ITEM' | 'DAMAGED_TRANSIT' | 'DEFECTIVE_QUALITY' | 'OTHER';
  reasonDetails: string;
  photos: string[];
  refundMethod?: 'UPI' | 'BANK';
  refundDetails?: string;
  status: 'PENDING' | 'APPROVED_REPLACEMENT' | 'APPROVED_REFUND' | 'REJECTED' | 'RESOLVED';
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export async function GET() {
  try {
    const returns = await readPersistentDataAsync<ShopReturnRequest[]>('shop_returns', []);
    return NextResponse.json({ returns });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      orderRef, customerName, customerPhone, customerEmail, 
      productTitle, requestType, reason, reasonDetails, 
      photos, refundMethod, refundDetails 
    } = body;

    if (!orderRef || !customerName || !customerPhone || !productTitle || !reason) {
      return NextResponse.json(
        { error: 'Please fill in all mandatory fields (Order ID, Name, Phone, Product Name, and Reason).' },
        { status: 400 }
      );
    }

    const ticketId = `RMA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: ShopReturnRequest = {
      id: ticketId,
      orderRef: String(orderRef).trim(),
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      customerEmail: String(customerEmail || '').trim(),
      productTitle: String(productTitle).trim(),
      requestType: requestType === 'REFUND' ? 'REFUND' : 'REPLACEMENT',
      reason: reason || 'DEFECTIVE_QUALITY',
      reasonDetails: String(reasonDetails || '').trim(),
      photos: Array.isArray(photos) ? photos : [],
      refundMethod: refundMethod || 'UPI',
      refundDetails: String(refundDetails || '').trim(),
      status: 'PENDING',
      adminNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existing = await readPersistentDataAsync<ShopReturnRequest[]>('shop_returns', []);
    const updated = [newRequest, ...existing];
    await writePersistentDataAsync('shop_returns', updated);

    return NextResponse.json({
      success: true,
      ticketId,
      request: newRequest,
      message: 'Return/Replacement request submitted successfully! Our team will inspect your details.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing return request ID' }, { status: 400 });
    }

    const existing = await readPersistentDataAsync<ShopReturnRequest[]>('shop_returns', []);
    const targetIdx = existing.findIndex((r) => r.id === id);

    if (targetIdx === -1) {
      return NextResponse.json({ error: 'Return request not found' }, { status: 404 });
    }

    const updated = [...existing];
    updated[targetIdx] = {
      ...updated[targetIdx],
      ...(status ? { status } : {}),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
      updatedAt: new Date().toISOString(),
    };

    await writePersistentDataAsync('shop_returns', updated);

    return NextResponse.json({
      success: true,
      request: updated[targetIdx],
      message: 'Return request updated successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
