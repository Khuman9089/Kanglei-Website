import { NextResponse } from 'next/server';
import { getPayUSettings, verifyPayUResponseHash } from '@/lib/payu';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = String(value);
    });

    const txnid = data.txnid || '';
    const amount = data.amount || '0.00';
    const status = (data.status || '').toLowerCase();
    const productinfo = data.productinfo || 'Consultation Service';
    const mihpayid = data.mihpayid || txnid;
    const bankRefNum = data.bank_ref_num || '';
    const udf1 = data.udf1 || ''; // orderType
    const udf2 = data.udf2 || '';
    const errorMessage = data.error_Message || data.field9 || 'Payment was unsuccessful or cancelled.';

    const payuConfig = await getPayUSettings();

    // Verify response hash
    const isHashValid = verifyPayUResponseHash(data, payuConfig.merchantSalt);

    // Resolve base URL for redirection
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    if (!isHashValid && payuConfig.mode === 'prod') {
      console.error('PayU Response Hash Verification Failed for txnid:', txnid);
      return NextResponse.redirect(`${baseUrl}/payment/failure?txnid=${txnid}&reason=Payment+security+verification+failed`, 303);
    }

    if (status === 'success') {
      // Retrieve stored pending order payload
      let pendingData: any = null;
      try {
        const pendingOrders = await readPersistentDataAsync<Record<string, any>>('payu_pending_transactions', {});
        pendingData = pendingOrders[txnid];
      } catch (e) {
        console.warn('Could not read pending transaction:', e);
      }

      const orderType = udf1 || pendingData?.orderType || 'kuthi';
      const orderRef = `KY-PAYU-${Math.floor(1000 + Math.random() * 9000)}`;

      if (orderType === 'shop' && pendingData?.orderPayload) {
        // Fulfill shop order
        try {
          const shopOrders = await readPersistentDataAsync<any[]>('shop_orders', []);
          const newShopOrder = {
            id: 'so-' + Date.now(),
            orderRef: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            buyerName: pendingData.orderPayload.buyerName || data.firstname || 'Customer',
            mobile: pendingData.orderPayload.mobile || data.phone || '',
            whatsappNo: pendingData.orderPayload.whatsappNo || data.phone || '',
            address: pendingData.orderPayload.address || '',
            pincode: pendingData.orderPayload.pincode || '',
            items: pendingData.orderPayload.items || [],
            subtotalAmount: pendingData.orderPayload.subtotalAmount || Number(amount),
            discountAmount: pendingData.orderPayload.discountAmount || 0,
            couponCode: pendingData.orderPayload.couponCode || '',
            shippingFee: pendingData.orderPayload.shippingFee || 0,
            totalAmount: Number(amount),
            utr: mihpayid || txnid,
            status: 'PAID',
            paymentStatus: 'PAYMENT_RECEIVED',
            adminConfirmed: true,
            orderedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            payuDetails: {
              txnid,
              mihpayid,
              bankRefNum,
              mode: data.mode || 'ONLINE',
            },
          };

          const updatedShop = [newShopOrder, ...shopOrders];
          await writePersistentDataAsync('shop_orders', updatedShop);
        } catch (shopErr) {
          console.error('Error recording shop order:', shopErr);
        }
      } else if (orderType === 'consultation' && pendingData?.orderPayload) {
        // Fulfill 1-on-1 Astrologer Chat / Voice Call Consultation Session
        try {
          const sessions = await readPersistentDataAsync<any[]>('consultation_sessions', []);
          const p = pendingData.orderPayload;
          const sessId = p.sessionId || 'SESS-' + Date.now();
          const sessOrderRef = p.orderRef || orderRef;
          const meetingLink = p.meetingLink || `/consultation?sessionId=${sessId}&role=client`;

          const newSession = {
            id: sessId,
            orderRef: sessOrderRef,
            mode: p.mode || 'CHAT',
            callType: p.callType || (p.mode === 'CALL' ? 'VIDEO' : 'AUDIO'),
            clientName: p.clientName || data.firstname || 'Verified Client',
            clientPhone: p.clientPhone || data.phone || '',
            astrologerId: p.astrologerId || 'astro-1',
            astrologerName: p.astrologerName || 'Jyotish Guru',
            astrologerAvatar: p.astrologerAvatar || '',
            astrologerPhone: p.astrologerPhone || '',
            status: 'CONFIRMED',
            durationMinutes: p.durationMinutes || 15,
            ratePerMin: p.ratePerMin || 30,
            totalFee: Number(amount),
            createdAt: new Date().toISOString(),
            scheduledDate: p.scheduledDate || new Date().toISOString().split('T')[0],
            shift: p.shift || 'Morning',
            paymentUtr: mihpayid || txnid,
            paymentStatus: 'VERIFIED',
            meetingLink,
            meetingLinkSent: true,
            remainingSeconds: (p.durationMinutes || 15) * 60,
            messages: [
              {
                id: 'msg-init-' + Date.now(),
                sender: 'SYSTEM',
                text: `Payment of ₹${amount} successfully received and verified via PayU Gateway. Session is confirmed for ${p.scheduledDate || 'today'} (${p.shift || 'Morning'} shift).`,
                timestamp: new Date().toISOString(),
              }
            ],
            signals: [],
            payuDetails: {
              txnid,
              mihpayid,
              bankRefNum,
              paymentMode: data.mode || 'PAYU_ONLINE',
            },
          };

          const updatedSessions = [newSession, ...sessions.filter((s: any) => s.id !== sessId)];
          await writePersistentDataAsync('consultation_sessions', updatedSessions);

          // Return with meeting room parameter so client portal can redirect straight to room
          const consultSuccessUrl = `${baseUrl}/payment/success?txnid=${encodeURIComponent(txnid)}&amount=${encodeURIComponent(amount)}&service=${encodeURIComponent(productinfo)}&payId=${encodeURIComponent(mihpayid)}&orderRef=${encodeURIComponent(sessOrderRef)}&meetingLink=${encodeURIComponent(meetingLink)}`;
          return NextResponse.redirect(consultSuccessUrl, 303);
        } catch (consultErr) {
          console.error('Error recording consultation session order:', consultErr);
        }
      } else {
        // Fulfill Kuthi / Auspicious / Matchmaking consultation order
        try {
          const kuthiOrders = await readPersistentDataAsync<any[]>('kuthi_orders', []);
          const newKuthiOrder = {
            id: 'k-' + Date.now(),
            orderRef,
            clientName: pendingData?.orderPayload?.clientName || pendingData?.clientName || data.firstname || 'Customer',
            sex: pendingData?.orderPayload?.gender || pendingData?.orderPayload?.sex || 'Client',
            mobile: pendingData?.orderPayload?.mobile || pendingData?.orderPayload?.whatsappNo || data.phone || '',
            whatsappNo: pendingData?.orderPayload?.whatsappNo || data.phone || '',
            email: data.email || pendingData?.email || '',
            kuthiAttached: !!pendingData?.orderPayload?.kuthiAttached || (pendingData?.orderPayload?.uploadedFiles && pendingData.orderPayload.uploadedFiles.length > 0),
            kuthiFileName: pendingData?.orderPayload?.kuthiFileName || (pendingData?.orderPayload?.uploadedFiles && pendingData.orderPayload.uploadedFiles[0]) || '',
            uploadedFiles: pendingData?.orderPayload?.uploadedFiles || [],
            dob: pendingData?.orderPayload?.dob || '',
            tob: pendingData?.orderPayload?.tob || '',
            pob: pendingData?.orderPayload?.pob || '',
            groomDetails: pendingData?.orderPayload?.groomDetails || undefined,
            brideDetails: pendingData?.orderPayload?.brideDetails || undefined,
            question: pendingData?.orderPayload?.question || pendingData?.orderPayload?.notes || '',
            utr: mihpayid || txnid,
            submittedAt: 'Just Now',
            amount: Number(amount),
            serviceType: productinfo,
            status: 'ASSIGNED',
            paymentStatus: 'PAYMENT_RECEIVED',
            fatherName: pendingData?.orderPayload?.fatherName || pendingData?.orderPayload?.rewriteDetails?.fatherName || '',
            motherName: pendingData?.orderPayload?.motherName || pendingData?.orderPayload?.rewriteDetails?.motherName || '',
            yek: pendingData?.orderPayload?.yek || pendingData?.orderPayload?.rewriteDetails?.yekSalai || '',
            gotra: pendingData?.orderPayload?.gotra || pendingData?.orderPayload?.rewriteDetails?.gotra || '',
            deliveryAddress: pendingData?.orderPayload?.deliveryAddress || pendingData?.orderPayload?.rewriteDetails?.deliveryAddress || '',
            category: pendingData?.orderPayload?.category || 'kuthi_yengba',
            faithTradition: pendingData?.orderPayload?.faithTradition || 'Hinduism',
            assignedAstrologerId: 'astro-1',
            assignedAstrologerName: 'Acharya Tombi Sharma',
            payuDetails: {
              txnid,
              mihpayid,
              bankRefNum,
              paymentMode: data.mode || 'PAYU_ONLINE',
            },
          };

          const updatedKuthi = [newKuthiOrder, ...kuthiOrders];
          await writePersistentDataAsync('kuthi_orders', updatedKuthi);

          // Try inserting to Supabase orders table
          try {
            await supabase.from('orders').insert([{
              id: newKuthiOrder.id,
              order_ref: newKuthiOrder.orderRef,
              client_name: newKuthiOrder.clientName,
              gender: newKuthiOrder.sex,
              mobile: newKuthiOrder.mobile,
              whatsapp_no: newKuthiOrder.whatsappNo,
              email: newKuthiOrder.email,
              amount: newKuthiOrder.amount,
              service_title: newKuthiOrder.serviceType,
              status: 'ASSIGNED',
              utr: newKuthiOrder.utr,
              payment_status: 'PAYMENT_RECEIVED',
              assigned_astrologer_id: 'astro-1',
              assigned_astrologer_name: 'Acharya Tombi Sharma',
            }]);
          } catch (dbErr) {
            console.warn('Supabase backup insert note:', dbErr);
          }
        } catch (kuthiErr) {
          console.error('Error recording kuthi order:', kuthiErr);
        }
      }

      // Success redirect to confirmation page
      const successUrl = `${baseUrl}/payment/success?txnid=${encodeURIComponent(txnid)}&amount=${encodeURIComponent(amount)}&service=${encodeURIComponent(productinfo)}&payId=${encodeURIComponent(mihpayid)}&orderRef=${encodeURIComponent(orderRef)}`;
      return NextResponse.redirect(successUrl, 303);
    } else {
      // Payment Failed or Cancelled
      console.warn('PayU payment was not successful:', { txnid, status, errorMessage });
      const failUrl = `${baseUrl}/payment/failure?txnid=${encodeURIComponent(txnid)}&reason=${encodeURIComponent(errorMessage)}`;
      return NextResponse.redirect(failUrl, 303);
    }
  } catch (err: any) {
    console.error('PayU callback handling error:', err);
    const host = req.headers.get('host') || 'localhost:3000';
    return NextResponse.redirect(`http://${host}/payment/failure?reason=${encodeURIComponent(err.message || 'Payment processing error')}`, 303);
  }
}
