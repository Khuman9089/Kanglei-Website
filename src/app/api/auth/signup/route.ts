import { NextResponse } from 'next/server';

// Temporary mock user store for demonstration before live PostgreSQL push
const mockUsers = new Map<string, any>();

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

    // Generate simulated 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const userData = {
      name,
      email: email.toLowerCase().trim(),
      phone,
      whatsappNo: whatsappNo || phone,
      address,
      sex: sex || 'Male',
      password,
      otpCode,
      otpExpiresAt,
      isVerified: false,
      createdAt: new Date(),
    };

    mockUsers.set(userData.email, userData);

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to WhatsApp / Phone (${userData.whatsappNo})`,
      email: userData.email,
      whatsappNo: userData.whatsappNo,
      demoOtpCode: otpCode, // Provided for easy UI testing
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
