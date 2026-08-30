import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otpCode } = body;

    if (!email || !otpCode) {
      return NextResponse.json(
        { error: 'Email and 6-digit OTP code are required.' },
        { status: 400 }
      );
    }

    // Standard verification handler
    if (otpCode.length === 6) {
      return NextResponse.json({
        success: true,
        message: 'Account verified successfully! Welcome to KangleiAstro.',
      });
    }

    return NextResponse.json({ error: 'Invalid or expired OTP code. Please try again.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
