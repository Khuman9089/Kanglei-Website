import { NextResponse } from 'next/server';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export interface SiteSettings {
  headerSettings: {
    supportTiming: string;
    supportEmail: string;
    supportPhone: string;
  };
  upiSettings: {
    upiId: string;
    payeeName: string;
    qrImageUrl: string;
    qrNotes: string;
  };
}

const DEFAULT_SETTINGS: SiteSettings = {
  headerSettings: {
    supportTiming: 'Live Support (9:30 AM – 6:00 PM IST)',
    supportEmail: 'ccare@kuthiyengpham.in',
    supportPhone: '+91 98765 43210',
  },
  upiSettings: {
    upiId: 'kuthiyengpham@upi',
    payeeName: 'KuthiYengpham Services',
    qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=kuthiyengpham@upi&pn=KuthiYengpham%20Services',
    qrNotes: 'Scan with GPay, PhonePe, Paytm, BHIM or any UPI app',
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

    await writePersistentDataAsync('site_settings', currentSettings);

    return NextResponse.json({
      success: true,
      message: 'Site Settings & Payment UPI QR Config saved live!',
      settings: currentSettings,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
