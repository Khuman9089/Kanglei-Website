import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import prisma from '@/lib/db';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';
import { sendRealMobileOtp } from '@/lib/otpService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, whatsappNo, address, sex, password } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Name, Email, Phone number, and Password are required fields.' },
        { status: 400 }
      );
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000;
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();
    const cleanWhatsApp = (whatsappNo || phone).trim();

    // Store in active OTPs persistent cache
    const otps = await readPersistentDataAsync<Record<string, any>>('active_otps', {});
    otps[cleanEmail] = { otpCode, expiresAt: otpExpiresAt, phone: cleanPhone, whatsappNo: cleanWhatsApp };
    otps[cleanPhone] = { otpCode, expiresAt: otpExpiresAt, email: cleanEmail, whatsappNo: cleanWhatsApp };
    otps[cleanWhatsApp] = { otpCode, expiresAt: otpExpiresAt, email: cleanEmail, phone: cleanPhone };
    await writePersistentDataAsync('active_otps', otps);

    // Dispatch real SMS / WhatsApp OTP directly to user's mobile number
    const dispatchResult = await sendRealMobileOtp({
      phone: cleanPhone,
      whatsappNo: cleanWhatsApp,
      otpCode,
    });

    // Save directly to Prisma Database if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });

        if (existingUser) {
          if (existingUser.isVerified) {
            return NextResponse.json(
              { error: 'An account with this email address already exists. Please log in.' },
              { status: 400 }
            );
          } else {
            await prisma.user.update({
              where: { email: cleanEmail },
              data: {
                name,
                phone: cleanPhone,
                whatsappNo: cleanWhatsApp,
                address,
                sex: sex || 'Male',
                hashedPassword: password,
                otpCode,
                otpExpiresAt: new Date(otpExpiresAt),
              },
            });
          }
        } else {
          await prisma.user.create({
            data: {
              name,
              email: cleanEmail,
              phone: cleanPhone,
              whatsappNo: cleanWhatsApp,
              address,
              sex: sex || 'Male',
              hashedPassword: password,
              otpCode,
              otpExpiresAt: new Date(otpExpiresAt),
              role: 'CLIENT',
            },
          });
        }
      } catch (dbErr) {
        console.warn('Prisma Database operation notice, using persistent store:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: dispatchResult.message,
      providerUsed: dispatchResult.providerUsed,
      sentRealSms: dispatchResult.sent,
      email: cleanEmail,
      phone: cleanPhone,
      whatsappNo: cleanWhatsApp,
      demoOtpCode: otpCode,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}

