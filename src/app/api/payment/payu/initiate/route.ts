import { NextResponse } from 'next/server';
import { getPayUSettings, generatePayUHash } from '@/lib/payu';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      amount,
      productInfo,
      firstname,
      email,
      phone,
      orderType,
      orderPayload,
    } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid payment amount' }, { status: 400 });
    }

    const payuConfig = await getPayUSettings();
    if (!payuConfig.enabled) {
      return NextResponse.json({
        success: false,
        error: 'PayU Payment Gateway is currently disabled by administrator. Please use Direct UPI / QR Code.',
      }, { status: 403 });
    }

    const txnid = `PAYU_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const formattedAmount = Number(amount).toFixed(2);
    const cleanPhone = (phone || '9862012345').replace(/[^0-9]/g, '').slice(-10) || '9862012345';
    const cleanEmail = (email && email.includes('@')) ? email.trim() : 'customer@kangleiastro.com';
    const cleanName = (firstname || 'Client').trim().slice(0, 50);
    const cleanProductInfo = (productInfo || 'Kanglei Astro Consultation Service').slice(0, 100);

    // Determine return base URL from request origin/headers
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    const surl = `${baseUrl}/api/payment/payu/response`;
    const furl = `${baseUrl}/api/payment/payu/response`;

    const udf1 = orderType || 'kuthi';
    const udf2 = txnid;
    const udf3 = '';
    const udf4 = '';
    const udf5 = '';

    // Calculate SHA-512 Hash
    const hash = generatePayUHash({
      key: payuConfig.merchantKey,
      txnid,
      amount: formattedAmount,
      productinfo: cleanProductInfo,
      firstname: cleanName,
      email: cleanEmail,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      salt: payuConfig.merchantSalt,
    });

    // Store pending order details for fulfillment on callback
    try {
      const pendingOrders = await readPersistentDataAsync<Record<string, any>>('payu_pending_transactions', {});
      pendingOrders[txnid] = {
        txnid,
        amount: Number(amount),
        productInfo: cleanProductInfo,
        clientName: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        orderType,
        orderPayload,
        createdAt: new Date().toISOString(),
      };
      await writePersistentDataAsync('payu_pending_transactions', pendingOrders);
    } catch (saveErr) {
      console.warn('Could not store pending transaction locally:', saveErr);
    }

    return NextResponse.json({
      success: true,
      mode: payuConfig.mode,
      actionUrl: payuConfig.paymentUrl,
      params: {
        key: payuConfig.merchantKey,
        txnid,
        amount: formattedAmount,
        productinfo: cleanProductInfo,
        firstname: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        surl,
        furl,
        hash,
        udf1,
        udf2,
        udf3,
        udf4,
        udf5,
      },
    });
  } catch (err: any) {
    console.error('PayU initiate error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Payment initiation failed' }, { status: 500 });
  }
}
