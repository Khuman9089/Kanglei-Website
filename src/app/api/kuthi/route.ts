import { NextResponse } from 'next/server';

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
  fatherName?: string;
  motherName?: string;
  yek?: string;
  gotra?: string;
  deliveryAddress?: string;
  category?: 'new_born_baby' | 'kuthi_rewrite';
  assignedAstrologerId?: string;
  assignedAstrologerName?: string;
  reportReceivedFromAstro?: boolean;
  reportFileName?: string;
  reportFileUrl?: string;
  reportUploadedAt?: string;
  reportUploadedBy?: string;
  reportNotes?: string;
}

let KUTHI_ORDERS: KuthiOrder[] = [
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
  {
    id: 'k-3',
    orderRef: 'KY-2026-8939',
    clientName: 'Nganba & Thoibi',
    sex: 'Couple',
    mobile: '+91 88374 87801',
    whatsappNo: '+91 88374 87801',
    email: 'nganba@example.com',
    kuthiAttached: false,
    dob: 'Groom: 1985-03-15 | Bride: 1989-03-21',
    tob: 'Groom: 18:15 | Bride: 19:16',
    pob: 'Groom: Imphal | Bride: Imphal',
    groomDetails: {
      name: 'Nganba Meitei',
      dob: '1985-03-15',
      tob: '18:15',
      pob: 'Imphal',
      long: '77.2',
      lat: '28.6',
    },
    brideDetails: {
      name: 'Thoibi Ningthoujam',
      dob: '1989-03-21',
      tob: '19:16',
      pob: 'Imphal',
      long: '72.8',
      lat: '19.0',
    },
    utr: '429809112830',
    submittedAt: 'Today, 04:20 PM',
    amount: 1299,
    serviceType: 'Kuthi Matching (পক্ন-ৱাইনবা য়েংবা)',
    status: 'PENDING',
  },
];

export async function GET() {
  return NextResponse.json({ success: true, orders: KUTHI_ORDERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, order, orderId, astroId, astroName } = body;

    if (action === 'CREATE_ORDER' && order) {
      const newOrder: KuthiOrder = {
        id: 'k-' + Date.now(),
        orderRef: 'KY-2026-' + Math.floor(1000 + Math.random() * 9000),
        clientName: order.clientName,
        sex: order.sex || 'Client',
        mobile: order.mobile,
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
        question: order.question || '',
        utr: order.utr,
        submittedAt: 'Just Now',
        amount: order.amount || 899,
        serviceType: order.serviceType || 'Kuthi Iba (কুঠি ইবা)',
        status: 'PENDING',
        fatherName: order.fatherName || '',
        motherName: order.motherName || '',
        yek: order.yek || '',
        gotra: order.gotra || '',
        deliveryAddress: order.deliveryAddress || '',
        category: order.category || 'new_born_baby',
      };

      KUTHI_ORDERS = [newOrder, ...KUTHI_ORDERS];
      return NextResponse.json({ success: true, order: newOrder, orders: KUTHI_ORDERS });
    }

    if (action === 'ASSIGN_ASTROLOGER' && orderId && astroId) {
      KUTHI_ORDERS = KUTHI_ORDERS.map((o) =>
        o.id === orderId
          ? { ...o, assignedAstrologerId: astroId, assignedAstrologerName: astroName, status: 'ASSIGNED' }
          : o
      );
      return NextResponse.json({ success: true, orders: KUTHI_ORDERS });
    }

    if (action === 'TOGGLE_REPORT_RECEIVED' && orderId) {
      KUTHI_ORDERS = KUTHI_ORDERS.map((o) =>
        o.id === orderId
          ? { ...o, reportReceivedFromAstro: !o.reportReceivedFromAstro, status: !o.reportReceivedFromAstro ? 'REPORT_RECEIVED' : 'ASSIGNED' }
          : o
      );
      return NextResponse.json({ success: true, orders: KUTHI_ORDERS });
    }

    if (action === 'UPLOAD_REPORT' && orderId) {
      const { reportFileName, reportFileUrl, reportNotes, uploadedBy } = body;
      KUTHI_ORDERS = KUTHI_ORDERS.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'COMPLETED',
              reportReceivedFromAstro: true,
              reportFileName: reportFileName || 'Astrological_Remedies_Report.pdf',
              reportFileUrl: reportFileUrl || '/sample_kuthi_report.pdf',
              reportUploadedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              reportUploadedBy: uploadedBy || o.assignedAstrologerName || 'Acharya Tombi Sharma',
              reportNotes: reportNotes || 'Detailed Vimshottari Dasha analysis and personalized remedies.',
            }
          : o
      );
      return NextResponse.json({ success: true, orders: KUTHI_ORDERS });
    }

    if (action === 'MARK_COMPLETED' && orderId) {
      KUTHI_ORDERS = KUTHI_ORDERS.map((o) =>
        o.id === orderId ? { ...o, status: 'COMPLETED' } : o
      );
      return NextResponse.json({ success: true, orders: KUTHI_ORDERS });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
