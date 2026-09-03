import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export interface KuthiOrder {
  id: string;
  orderRef: string;
  clientName: string;
  sex: string;
  mobile: string;
  whatsappNo: string;
  email?: string;
  kuthiAttached: boolean;
  kuthiFileName?: string;
  kuthiFileUrl?: string;
  dob?: string;
  tob?: string;
  pob?: string;
  groomDetails?: {
    name: string;
    dob: string;
    tob: string;
    pob: string;
    long?: string;
    lat?: string;
  };
  brideDetails?: {
    name: string;
    dob: string;
    tob: string;
    pob: string;
    long?: string;
    lat?: string;
  };
  question?: string;
  utr: string;
  submittedAt: string;
  amount: number;
  serviceType: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_ANALYSIS' | 'REPORT_RECEIVED' | 'COMPLETED';
  paymentStatus?: 'PAYMENT_RECEIVED' | 'PAYMENT_NOT_RECEIVED' | 'VERIFICATION_PENDING';
  fatherName?: string;
  motherName?: string;
  yek?: string;
  gotra?: string;
  deliveryAddress?: string;
  category?: string;
  assignedAstrologerId?: string;
  assignedAstrologerName?: string;
  reportReceivedFromAstro?: boolean;
  reportFileName?: string;
  reportFileUrl?: string;
  reportUploadedAt?: string;
  reportUploadedBy?: string;
  reportNotes?: string;
  clientRequirement?: string;
}

const DEFAULT_KUTHI_ORDERS: KuthiOrder[] = [
  {
    id: 'k-1',
    orderRef: 'KY-2026-8941',
    clientName: 'Nganba Meitei',
    sex: 'Male',
    mobile: '+91 98620 12345',
    whatsappNo: '+91 98620 12345',
    email: 'nganba@example.com',
    kuthiAttached: true,
    kuthiFileName: 'nganba_kuthi_paper.pdf',
    kuthiFileUrl: '/sample_kuthi.pdf',
    dob: '1995-05-15',
    tob: '10:30 AM',
    pob: 'Imphal West',
    question: 'Please check career prospects in 2026 and marriage compatibility.',
    utr: '429810394812',
    submittedAt: 'Today, 10:15 AM',
    amount: 499,
    serviceType: 'Kuthi Yengba Consultation',
    status: 'PENDING',
  },
  {
    id: 'k-2',
    orderRef: 'KY-2026-8942',
    clientName: 'Thoibi Ningthoujam',
    sex: 'Female',
    mobile: '+91 98561 88210',
    whatsappNo: '+91 98561 88210',
    email: 'thoibi@example.com',
    kuthiAttached: false,
    dob: '1996-04-12',
    tob: '08:30 AM',
    pob: 'Imphal East',
    question: 'Asking about health remedies for Rahu Dasha.',
    utr: '429810441920',
    submittedAt: 'Today, 09:40 AM',
    amount: 499,
    serviceType: 'Kuthi Yengba Consultation',
    status: 'ASSIGNED',
    assignedAstrologerId: 'astro-1',
    assignedAstrologerName: 'Acharya Tombi Sharma',
  },
];

export async function GET() {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const dbOrders: KuthiOrder[] = data.map((d: any) => ({
        id: d.id,
        orderRef: d.order_ref || d.id,
        clientName: d.client_name,
        sex: d.gender || d.sex || 'Client',
        mobile: d.mobile || d.whatsapp_no,
        whatsappNo: d.whatsapp_no || d.mobile,
        email: d.email || '',
        kuthiAttached: !!d.kuthi_attached,
        kuthiFileName: d.kuthi_file_name,
        dob: d.dob,
        tob: d.tob,
        pob: d.pob,
        utr: d.utr,
        submittedAt: d.submitted_at || new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        amount: d.amount || d.total_amount || 499,
        serviceType: d.service_title || d.service_type || 'Kuthi Consultation',
        status: d.status || 'PENDING',
        fatherName: d.father_name,
        motherName: d.mother_name,
        deliveryAddress: d.delivery_address,
        category: d.category,
        assignedAstrologerId: d.assigned_astrologer_id,
        assignedAstrologerName: d.assigned_astrologer_name,
        clientRequirement: d.client_requirement,
      }));
      return NextResponse.json({ success: true, orders: dbOrders });
    }
  } catch (err) {
    console.warn('Supabase fetch fallback to local:', err);
  }

  const orders = await readPersistentDataAsync<KuthiOrder[]>('kuthi_orders', DEFAULT_KUTHI_ORDERS);
  return NextResponse.json({ success: true, orders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, order, orderId, astroId, astroName } = body;
    let orders = await readPersistentDataAsync<KuthiOrder[]>('kuthi_orders', DEFAULT_KUTHI_ORDERS);

    if (action === 'CREATE_ORDER' && order) {
      const newId = 'k-' + Date.now();
      const orderRef = 'KY-2026-' + Math.floor(1000 + Math.random() * 9000);

      const newOrder: KuthiOrder = {
        id: newId,
        orderRef: orderRef,
        clientName: order.clientName,
        sex: order.gender || order.sex || 'Client',
        mobile: order.mobile || order.whatsappNo,
        whatsappNo: order.whatsappNo || order.mobile,
        email: order.email || '',
        kuthiAttached: !!order.kuthiAttached,
        kuthiFileName: order.kuthiFileName || '',
        kuthiFileUrl: order.kuthiFileUrl || '',
        dob: order.dob || '',
        tob: order.tob || '',
        pob: order.pob || '',
        groomDetails: order.groomDetails || undefined,
        brideDetails: order.brideDetails || undefined,
        question: order.question || order.notes || '',
        utr: order.utr || '',
        submittedAt: 'Just Now',
        amount: order.totalAmount || order.amount || 499,
        serviceType: order.serviceTitle || order.serviceType || 'Kuthi Yengba',
        status: 'PENDING',
        paymentStatus: 'VERIFICATION_PENDING',
        fatherName: order.fatherName || order.rewriteDetails?.fatherName || '',
        motherName: order.motherName || order.rewriteDetails?.motherName || '',
        yek: order.yek || order.rewriteDetails?.yekSalai || '',
        gotra: order.gotra || order.rewriteDetails?.gotra || '',
        deliveryAddress: order.deliveryAddress || order.rewriteDetails?.deliveryAddress || '',
        category: order.category || 'kuthi_yengba',
        clientRequirement: order.clientRequirement || '',
      };

      // Try inserting into Supabase
      try {
        await supabase.from('orders').insert([
          {
            id: newOrder.id,
            order_ref: newOrder.orderRef,
            client_name: newOrder.clientName,
            gender: newOrder.sex,
            mobile: newOrder.mobile,
            whatsapp_no: newOrder.whatsappNo,
            email: newOrder.email,
            kuthi_attached: newOrder.kuthiAttached,
            kuthi_file_name: newOrder.kuthiFileName,
            dob: newOrder.dob,
            tob: newOrder.tob,
            pob: newOrder.pob,
            utr: newOrder.utr,
            amount: newOrder.amount,
            service_title: newOrder.serviceType,
            status: newOrder.status,
            father_name: newOrder.fatherName,
            mother_name: newOrder.motherName,
            delivery_address: newOrder.deliveryAddress,
            category: newOrder.category,
            client_requirement: newOrder.clientRequirement,
          },
        ]);
      } catch (dbErr) {
        console.warn('Supabase insert fallback:', dbErr);
      }

      orders = [newOrder, ...orders];
      await writePersistentDataAsync('kuthi_orders', orders);
      return NextResponse.json({ success: true, order: newOrder, orders });
    }

    if (action === 'ASSIGN_ASTROLOGER' && orderId && astroId) {
      try {
        await supabase.from('orders').update({ assigned_astrologer_id: astroId, assigned_astrologer_name: astroName, status: 'ASSIGNED' }).eq('id', orderId);
      } catch (e) {}

      orders = orders.map((o) =>
        o.id === orderId
          ? { ...o, assignedAstrologerId: astroId, assignedAstrologerName: astroName, status: 'ASSIGNED' }
          : o
      );
      await writePersistentDataAsync('kuthi_orders', orders);
      return NextResponse.json({ success: true, orders });
    }

    if (action === 'MARK_COMPLETED' && orderId) {
      try {
        await supabase.from('orders').update({ status: 'COMPLETED' }).eq('id', orderId);
      } catch (e) {}

      orders = orders.map((o) =>
        o.id === orderId ? { ...o, status: 'COMPLETED' } : o
      );
      await writePersistentDataAsync('kuthi_orders', orders);
      return NextResponse.json({ success: true, orders });
    }

    if (action === 'UPDATE_PAYMENT_STATUS' && orderId) {
      const pStatus = body.paymentStatus;
      orders = orders.map((o) =>
        o.id === orderId ? { ...o, paymentStatus: pStatus } : o
      );
      await writePersistentDataAsync('kuthi_orders', orders);
      return NextResponse.json({ success: true, message: 'Kuthi Order Payment Status updated live!', orders });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
