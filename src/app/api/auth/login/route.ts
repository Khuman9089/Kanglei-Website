import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
import prisma from '@/lib/db';

const DEMO_CLIENTS: Record<string, any> = {
  'nganba@example.com': {
    id: 'client-1',
    name: 'Nganba Meitei',
    email: 'nganba@example.com',
    phone: '+91 98620 12345',
    whatsappNo: '+91 98620 12345',
    sex: 'Male',
    address: 'Uripok, Imphal West, Manipur',
    role: 'CLIENT',
    joinedAt: '2026-01-15',
  },
};

const DEMO_ASTROLOGERS: Record<string, any> = {
  '+91 98620 99881': {
    id: 'astro-1',
    name: 'Acharya Tombi Sharma',
    email: 'tombi@kangleiastro.com',
    phone: '+91 98620 99881',
    whatsappNo: '+91 98620 99881',
    specialty: 'Vedic Horoscope & Kuthi Yengba Specialist',
    completedCount: 142,
    pendingPayout: 3500,
    role: 'ASTROLOGER',
    joinedAt: '2024-06-10',
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password, role } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/Phone and Password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please enter password (4+ characters).' },
        { status: 401 }
      );
    }

    // Attempt Prisma Database query if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      try {
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier.toLowerCase().trim() },
              { phone: identifier.trim() },
              { whatsappNo: identifier.trim() },
            ],
          },
        });

        if (dbUser) {
          if (dbUser.hashedPassword && dbUser.hashedPassword !== password) {
            return NextResponse.json(
              { error: 'Incorrect password. Please try again.' },
              { status: 401 }
            );
          }

          const userRoleStr = String(dbUser.role);
          return NextResponse.json({
            success: true,
            user: {
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              phone: dbUser.phone,
              whatsappNo: dbUser.whatsappNo,
              sex: dbUser.sex,
              address: dbUser.address,
              role: userRoleStr,
              joinedAt: dbUser.createdAt.toISOString().split('T')[0],
            },
            redirectTo: userRoleStr === 'ASTROLOGER' ? '/dashboard/astrologer' : (userRoleStr === 'ADMIN' ? '/admin' : '/dashboard/client'),
          });
        }
      } catch (dbErr) {
        console.warn('Prisma DB query failed, falling back to demo store:', dbErr);
      }
    }

    // Fallback store handling
    if (role === 'ASTROLOGER') {
      const astro = DEMO_ASTROLOGERS[identifier] || DEMO_ASTROLOGERS[identifier.trim()];
      return NextResponse.json({
        success: true,
        user: astro || {
          id: 'astro-' + Date.now(),
          name: 'Empaneled Astrologer',
          email: 'astrologer@kangleiastro.com',
          phone: identifier,
          whatsappNo: identifier,
          specialty: 'Vedic Astrology Specialist',
          role: 'ASTROLOGER',
          joinedAt: new Date().toISOString().split('T')[0],
        },
        redirectTo: '/dashboard/astrologer',
      });
    } else {
      const client = DEMO_CLIENTS[identifier.toLowerCase().trim()];
      return NextResponse.json({
        success: true,
        user: client || {
          id: 'client-' + Date.now(),
          name: identifier.split('@')[0] || 'Client',
          email: identifier.toLowerCase().trim(),
          phone: '+91 98620 12345',
          whatsappNo: '+91 98620 12345',
          sex: 'Male',
          address: 'Imphal, Manipur',
          role: 'CLIENT',
          joinedAt: new Date().toISOString().split('T')[0],
        },
        redirectTo: '/dashboard/client',
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
