import { NextResponse } from 'next/server';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export interface PayUSiteSettings {
  enabled: boolean;
  mode: 'test' | 'prod';
  merchantKey: string;
  merchantSalt: string;
  paymentUrl: string;
  testMerchantKey?: string;
  testMerchantSalt?: string;
  testPaymentUrl?: string;
  prodMerchantKey?: string;
  prodMerchantSalt?: string;
  prodPaymentUrl?: string;
}

export interface BranchOffice {
  id: string;
  name: string;
  address: string;
  pincode?: string;
  phone?: string;
  email?: string;
  timing?: string;
}

export interface ContactSettings {
  brandName: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  timing?: string;
  mapEmbedUrl?: string;
  branchOffices: BranchOffice[];
}

export interface SiteSettings {
  headerSettings: {
    supportTiming: string;
    supportEmail: string;
    supportPhone: string;
  };
  upiSettings: {
    enabled?: boolean;
    upiId: string;
    payeeName: string;
    qrImageUrl: string;
    qrNotes: string;
  };
  payuSettings?: PayUSiteSettings;
  contactSettings?: ContactSettings;
}

const DEFAULT_SETTINGS: SiteSettings = {
  headerSettings: {
    supportTiming: 'Live Support (9:30 AM – 6:00 PM IST)',
    supportEmail: 'ccare@kuthiyengpham.in',
    supportPhone: '+91 98765 43210',
  },
  upiSettings: {
    enabled: true,
    upiId: 'kuthiyengpham@upi',
    payeeName: 'KuthiYengpham Services',
    qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=kuthiyengpham@upi&pn=KuthiYengpham%20Services',
    qrNotes: 'Scan with GPay, PhonePe, Paytm, BHIM or any UPI app',
  },
  payuSettings: {
    enabled: true,
    mode: 'test',
    merchantKey: 'gtKFFx',
    merchantSalt: 'eCwWELxi',
    paymentUrl: 'https://test.payu.in/_payment',
    testMerchantKey: 'gtKFFx',
    testMerchantSalt: 'eCwWELxi',
    testPaymentUrl: 'https://test.payu.in/_payment',
    prodMerchantKey: '',
    prodMerchantSalt: '',
    prodPaymentUrl: 'https://secure.payu.in/_payment',
  },
  contactSettings: {
    brandName: 'KuthiYengpham by KangleiAstro',
    phone: '9999999999',
    email: 'ccare@kuthiyengpham.in',
    address: 'Khurai Chingangbam Leikai, Tinsid Road, Imphal East, Manipur',
    pincode: '795005',
    timing: 'Monday – Saturday: 9:30 AM – 6:00 PM IST',
    branchOffices: [],
  },
};

export async function GET() {
  const settings = await readPersistentDataAsync<SiteSettings>('site_settings', DEFAULT_SETTINGS);
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let currentSettings = await readPersistentDataAsync<SiteSettings>('site_settings', DEFAULT_SETTINGS);

    if (body.headerSettings) {
      currentSettings.headerSettings = {
        ...currentSettings.headerSettings,
        ...body.headerSettings,
      };
    }

    if (body.upiSettings) {
      currentSettings.upiSettings = {
        ...currentSettings.upiSettings,
        ...body.upiSettings,
      };
    }

    if (body.payuSettings) {
      currentSettings.payuSettings = {
        ...(currentSettings.payuSettings || DEFAULT_SETTINGS.payuSettings),
        ...body.payuSettings,
      };
    }

    if (body.contactSettings) {
      currentSettings.contactSettings = {
        ...(currentSettings.contactSettings || DEFAULT_SETTINGS.contactSettings),
        ...body.contactSettings,
      };
    }

    await writePersistentDataAsync('site_settings', currentSettings);

    return NextResponse.json({
      success: true,
      message: 'Site Settings, Payment UPI QR, PayU Gateway & Contact Details saved live!',
      settings: currentSettings,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
