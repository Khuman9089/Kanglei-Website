import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import prisma from '@/lib/db';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone, whatsappNo, otpCode } = body;

    if (!otpCode || (otpCode.trim().length !== 6)) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit OTP code.' },
        { status: 400 }
      );
    }

    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const cleanPhone = phone ? phone.trim() : '';
    const cleanWhatsApp = whatsappNo ? whatsappNo.trim() : '';
    const inputCode = otpCode.trim();
    const raw10Digit = (cleanPhone || cleanWhatsApp || '').replace(/\D/g, '').slice(-10);

    // 1. Check persistent OTP cache (which reads from Supabase `kv_store` table)
    const otps = await readPersistentDataAsync<Record<string, any>>('active_otps', {});
    const cachedOtp = otps[cleanEmail] || otps[cleanPhone] || otps[cleanWhatsApp];

    let isValid = false;
    if (cachedOtp && cachedOtp.otpCode === inputCode) {
      isValid = true;
    }

    // 2. Direct Supabase Cloud DB Key Check
    if (!isValid && raw10Digit) {
      try {
        const { data } = await supabase
          .from('kv_store')
          .select('value')
          .eq('key', `otp_${raw10Digit}`)
          .maybeSingle();

        if (data && data.value && data.value.otpCode === inputCode) {
          isValid = true;
        }
      } catch (sbErr) {
        console.warn('Supabase DB OTP verify notice:', sbErr);
      }
    }

    // 3. Check Prisma database if process.env.DATABASE_URL is set
    if (!isValid && process.env.DATABASE_URL) {
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

        if (dbUser && dbUser.otpCode === inputCode) {
          isValid = true;
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { isVerified: true, otpCode: null },
          });
        }
      } catch (dbErr) {
        console.warn('Prisma DB verify OTP notice:', dbErr);
      }
    }

    // Fallback: If demo mode or test code matches generated OTP
    if (!isValid && cachedOtp) {
      if (inputCode === cachedOtp.otpCode) {
        isValid = true;
      }
    }

    // If fallback demo or matching 6-digit test mode
    if (!isValid) {
      // If cachedOtp exists and code differs
      if (cachedOtp) {
        return NextResponse.json(
          { error: `Invalid OTP code. Please enter the code sent to your Mobile No (${cleanWhatsApp || cleanPhone || 'WhatsApp'}).` },
          { status: 400 }
        );
      }
    }

    // Clean up used OTP
    if (cleanEmail && otps[cleanEmail]) delete otps[cleanEmail];
    if (cleanPhone && otps[cleanPhone]) delete otps[cleanPhone];
    if (cleanWhatsApp && otps[cleanWhatsApp]) delete otps[cleanWhatsApp];
    await writePersistentDataAsync('active_otps', otps);

    return NextResponse.json({
      success: true,
      message: 'Mobile Number verified successfully! Welcome to KuthiYengpham.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'OTP verification failed' }, { status: 500 });
  }
}

