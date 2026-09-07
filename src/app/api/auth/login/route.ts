import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { readPersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

function extractLast10Digits(phoneStr?: string): string {
  if (!phoneStr) return '';
  const digits = phoneStr.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

const DEMO_CLIENTS: Record<string, any> = {};
const DEMO_ASTROLOGERS: Record<string, any> = {};

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

    // 3. Astrologer Role Authentication
    if (role === 'ASTROLOGER') {
      try {
        const astrologers = await readPersistentDataAsync<any[]>('astrologers', []);
        const matchedAstro = astrologers.find((a) => {
          if (a.username && a.username.toLowerCase().trim() === cleanIdLower) return true;
          if (a.email && a.email.toLowerCase().trim() === cleanIdLower) return true;
          if (a.phone && a.phone.trim() === cleanId) return true;
          if (a.whatsappPhone && a.whatsappPhone.trim() === cleanId) return true;
          if (a.whatsappNo && a.whatsappNo.trim() === cleanId) return true;
          if (idLast10) {
            const p10 = extractLast10Digits(a.phone);
            const w10 = extractLast10Digits(a.whatsappPhone || a.whatsappNo);
            if (p10 === idLast10 || w10 === idLast10) return true;
          }
          return false;
        });

        if (matchedAstro) {
          if (matchedAstro.password && matchedAstro.password !== password) {
            return NextResponse.json(
              { error: 'Incorrect astrologer password. Please try again.' },
              { status: 401 }
            );
          }

          return NextResponse.json({
            success: true,
            user: {
              id: matchedAstro.id,
              name: matchedAstro.name,
              email: matchedAstro.email || '',
              phone: matchedAstro.phone || matchedAstro.whatsappPhone || matchedAstro.whatsappNo || '',
              whatsappNo: matchedAstro.whatsappPhone || matchedAstro.whatsappNo || matchedAstro.phone || '',
              specialty: matchedAstro.specialty || (Array.isArray(matchedAstro.specialties) ? matchedAstro.specialties.join(', ') : 'Vedic Astrologer'),
              avatar: matchedAstro.avatar || '',
              role: 'ASTROLOGER',
              joinedAt: matchedAstro.joinedAt || new Date().toISOString().split('T')[0],
            },
            redirectTo: '/dashboard/astrologer',
          });
        }
      } catch (astroErr) {
        console.warn('Persistent store astrologer query notice:', astroErr);
      }

      return NextResponse.json(
        { error: 'No registered astrologer found with these credentials. Please contact the administrator.' },
        { status: 401 }
      );
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
