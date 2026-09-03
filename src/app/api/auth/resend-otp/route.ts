import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';
import { sendRealMobileOtp } from '@/lib/otpService';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone, whatsappNo } = body;

    if (!email && !phone && !whatsappNo) {
      return NextResponse.json(
        { error: 'Mobile number or email is required to resend OTP.' },
        { status: 400 }
      );
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000;

    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const cleanPhone = phone ? phone.trim() : '';
    const cleanWhatsApp = whatsappNo ? whatsappNo.trim() : cleanPhone;

    // Save into persistent store
    const otps = await readPersistentDataAsync<Record<string, any>>('active_otps', {});
    const record = { otpCode, expiresAt: otpExpiresAt, phone: cleanPhone, whatsappNo: cleanWhatsApp, email: cleanEmail };
    
    if (cleanEmail) otps[cleanEmail] = record;
    if (cleanPhone) otps[cleanPhone] = record;
    if (cleanWhatsApp) otps[cleanWhatsApp] = record;

    await writePersistentDataAsync('active_otps', otps);

    // Dispatch real SMS / WhatsApp OTP directly to user's mobile number
    const dispatchResult = await sendRealMobileOtp({
      phone: cleanPhone,
      whatsappNo: cleanWhatsApp,
      otpCode,
    });

    // Save in Prisma DB if available
    if (process.env.DATABASE_URL) {
      try {
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: cleanEmail || undefined },
              { phone: cleanPhone || undefined },
              { whatsappNo: cleanWhatsApp || undefined },
            ],
          },
        });
        if (dbUser) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { otpCode, otpExpiresAt: new Date(otpExpiresAt) },
          });
        }
      } catch (err) {
        console.warn('Prisma DB resend OTP notice:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: dispatchResult.message,
      providerUsed: dispatchResult.providerUsed,
      sentRealSms: dispatchResult.sent,
      demoOtpCode: otpCode,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to resend OTP' }, { status: 500 });
  }
}
