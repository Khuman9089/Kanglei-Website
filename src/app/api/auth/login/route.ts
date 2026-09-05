import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { readPersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

function extractLast10Digits(phoneStr?: string): string {
  if (!phoneStr) return '';
  const digits = phoneStr.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

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

    const cleanId = identifier.trim();
    const cleanIdLower = cleanId.toLowerCase();
    const idLast10 = extractLast10Digits(cleanId);

    // 1. Attempt Prisma Database query if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      try {
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: cleanIdLower },
              { phone: cleanId },
              { whatsappNo: cleanId },
              ...(idLast10 ? [{ phone: { contains: idLast10 } }, { whatsappNo: { contains: idLast10 } }] : []),
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
        console.warn('Prisma DB query failed, falling back to persistent store:', dbErr);
      }
    }

    // 2. Check persistent database (client_base in Supabase & Local JSON)
    if (role === 'CLIENT' || !role) {
      try {
        const clients = await readPersistentDataAsync<any[]>('client_base', []);
        const matchedClient = clients.find((c) => {
          if (c.email && c.email.toLowerCase().trim() === cleanIdLower) return true;
          if (idLast10) {
            const cPhone10 = extractLast10Digits(c.phone);
            const cWhatsapp10 = extractLast10Digits(c.whatsappNo);
            if (cPhone10 === idLast10 || cWhatsapp10 === idLast10) return true;
          }
          return false;
        });

        if (matchedClient) {
          if (matchedClient.password && matchedClient.password !== password) {
            return NextResponse.json(
              { error: 'Incorrect password. Please try again.' },
              { status: 401 }
            );
          }

          return NextResponse.json({
            success: true,
            user: {
              id: matchedClient.id,
              name: matchedClient.name,
              email: matchedClient.email,
              phone: matchedClient.phone,
              whatsappNo: matchedClient.whatsappNo,
              sex: matchedClient.sex,
              address: matchedClient.address,
              deliveryAddress: matchedClient.deliveryAddress,
              role: 'CLIENT',
              joinedAt: matchedClient.joinedAt || new Date().toISOString().split('T')[0],
            },
            redirectTo: '/dashboard/client',
          });
        }
      } catch (storeErr) {
        console.warn('Persistent store client query notice:', storeErr);
      }
    }

    // 3. Astrologer Role Fallback
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
    }

    // 4. Client Demo Fallback
    const demoClient = DEMO_CLIENTS[cleanIdLower];
    if (demoClient) {
      return NextResponse.json({
        success: true,
        user: demoClient,
        redirectTo: '/dashboard/client',
      });
    }

    return NextResponse.json(
      { error: 'No account found with these credentials. Please check your email/mobile or sign up.' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
