import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

function extractLast10Digits(phoneStr?: string): string {
  if (!phoneStr) return '';
  const digits = phoneStr.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      whatsappNo,
      address,
      deliveryAddress,
      sex,
      password,
      firebaseUid,
      isVerified,
    } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Name, Email, Phone number, and Password are required fields.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();
    const cleanWhatsApp = (whatsappNo || phone).trim();
    const phone10 = extractLast10Digits(cleanPhone);
    const whatsapp10 = extractLast10Digits(cleanWhatsApp);

    // ─────────────────────────────────────────────────────────────
    // 1. DUPLICATE CHECK AGAINST DATABASE
    // ─────────────────────────────────────────────────────────────
    const clients = await readPersistentDataAsync<any[]>('client_base', []);

    // Check duplicate email
    const duplicateEmailClient = clients.find(
      (c) => c.email && c.email.toLowerCase().trim() === cleanEmail
    );
    if (duplicateEmailClient) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please log in.', field: 'email' },
        { status: 400 }
      );
    }

    // Check duplicate mobile number
    if (phone10) {
      const duplicatePhoneClient = clients.find((c) => {
        const cPhone10 = extractLast10Digits(c.phone);
        const cWhatsapp10 = extractLast10Digits(c.whatsappNo);
        return cPhone10 === phone10 || cWhatsapp10 === phone10;
      });
      if (duplicatePhoneClient) {
        return NextResponse.json(
          { error: 'An account with this mobile number already exists. Please log in.', field: 'phone' },
          { status: 400 }
        );
      }
    }

    // Check Prisma database if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      try {
        const existingPrismaEmail = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });
        if (existingPrismaEmail) {
          return NextResponse.json(
            { error: 'An account with this email address already exists. Please log in.', field: 'email' },
            { status: 400 }
          );
        }

        if (phone10) {
          const existingPrismaPhone = await prisma.user.findFirst({
            where: {
              OR: [
                { phone: { contains: phone10 } },
                { whatsappNo: { contains: phone10 } },
              ],
            },
          });
          if (existingPrismaPhone) {
            return NextResponse.json(
              { error: 'An account with this mobile number already exists. Please log in.', field: 'phone' },
              { status: 400 }
            );
          }
        }
      } catch (prismaErr) {
        console.warn('Prisma duplicate check notice:', prismaErr);
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. SAVE NEW CLIENT TO DATABASE (client_base in Supabase & Local JSON)
    // ─────────────────────────────────────────────────────────────
    const newClient = {
      id: `client-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      whatsappNo: cleanWhatsApp,
      address: (address || '').trim(),
      deliveryAddress: (deliveryAddress || address || '').trim(),
      sex: sex || 'Male',
      password: password,
      firebaseUid: firebaseUid || null,
      role: 'CLIENT',
      joinedAt: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      totalSpent: 0,
      savedKundlisCount: 0,
      status: isVerified ? 'VERIFIED' : 'ACTIVE',
    };

    clients.unshift(newClient);
    await writePersistentDataAsync('client_base', clients);

    // Also persist to Prisma Database if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      try {
        await prisma.user.create({
          data: {
            name: newClient.name,
            email: cleanEmail,
            phone: cleanPhone,
            whatsappNo: cleanWhatsApp,
            address: newClient.address,
            sex: newClient.sex,
            hashedPassword: password,
            isVerified: Boolean(isVerified),
            role: 'CLIENT',
          },
        });
      } catch (dbErr) {
        console.warn('Prisma Database create user notice:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully with verified mobile number.',
      user: {
        id: newClient.id,
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        whatsappNo: newClient.whatsappNo,
        address: newClient.address,
        deliveryAddress: newClient.deliveryAddress,
        sex: newClient.sex,
        role: newClient.role,
        joinedAt: newClient.joinedAt,
        firebaseUid: newClient.firebaseUid,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
