import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, identifier, currentPassword, newPassword, otpCode, role } = body;

    // ACTION 1: REQUEST OTP FOR FORGOT PASSWORD
    if (action === 'REQUEST_RESET_OTP') {
      if (!identifier) {
        return NextResponse.json({ error: 'Email or Phone Number is required.' }, { status: 400 });
      }

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      if (process.env.DATABASE_URL) {
        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: identifier.toLowerCase().trim() },
                { phone: identifier.trim() },
                { whatsappNo: identifier.trim() },
              ],
            },
          });

          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                otpCode: generatedOtp,
                otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
              },
            });
          }
        } catch (dbErr) {
          console.warn('Prisma reset OTP update error:', dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: `OTP Code sent to registered contact (${identifier})`,
        demoOtpCode: generatedOtp,
      });
    }

    // ACTION 2: RESET PASSWORD WITH OTP
    if (action === 'RESET_PASSWORD_WITH_OTP') {
      if (!identifier || !newPassword || newPassword.length < 4) {
        return NextResponse.json({ error: 'Valid contact and new password (4+ chars) are required.' }, { status: 400 });
      }

      if (process.env.DATABASE_URL) {
        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: identifier.toLowerCase().trim() },
                { phone: identifier.trim() },
                { whatsappNo: identifier.trim() },
              ],
            },
          });

          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: { hashedPassword: newPassword },
            });
          }
        } catch (dbErr) {
          console.warn('Prisma reset password error:', dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Password reset successfully! You can now log in with your new password.',
      });
    }

    // ACTION 3: DIRECT CHANGE PASSWORD (LOGGED-IN USER)
    if (action === 'CHANGE_PASSWORD') {
      if (!identifier || !newPassword || newPassword.length < 4) {
        return NextResponse.json({ error: 'New password must be at least 4 characters.' }, { status: 400 });
      }

      if (process.env.DATABASE_URL) {
        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: identifier.toLowerCase().trim() },
                { phone: identifier.trim() },
                { whatsappNo: identifier.trim() },
              ],
            },
          });

          if (user) {
            if (currentPassword && user.hashedPassword && user.hashedPassword !== currentPassword) {
              return NextResponse.json({ error: 'Current password does not match.' }, { status: 400 });
            }

            await prisma.user.update({
              where: { id: user.id },
              data: { hashedPassword: newPassword },
            });
          }
        } catch (dbErr) {
          console.warn('Prisma change password error:', dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully!',
      });
    }

    return NextResponse.json({ error: 'Invalid action parameter.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Password request failed' }, { status: 500 });
  }
}
