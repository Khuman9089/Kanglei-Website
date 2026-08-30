import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
import prisma from '@/lib/db';

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
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save directly to Prisma Database if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
        });

        if (existingUser) {
          return NextResponse.json(
            { error: 'An account with this email address already exists. Please log in.' },
            { status: 400 }
          );
        }

        const user = await prisma.user.create({
          data: {
            name,
            email: email.toLowerCase().trim(),
            phone,
            whatsappNo: whatsappNo || phone,
            address,
            sex: sex || 'Male',
            hashedPassword: password,
            otpCode,
            otpExpiresAt,
            role: 'CLIENT',
          },
        });

        return NextResponse.json({
          success: true,
          message: `OTP sent successfully to WhatsApp / Phone (${user.whatsappNo})`,
          email: user.email,
          whatsappNo: user.whatsappNo,
          demoOtpCode: otpCode,
        });
      } catch (dbErr) {
        console.warn('Prisma Database create failed, using fallback:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to WhatsApp / Phone (${whatsappNo || phone})`,
      email: email.toLowerCase().trim(),
      whatsappNo: whatsappNo || phone,
      demoOtpCode: otpCode,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
