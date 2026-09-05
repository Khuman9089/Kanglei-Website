import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { readPersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

function extractLast10Digits(phoneStr?: string): string {
  if (!phoneStr) return '';
  const digits = phoneStr.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone, whatsappNo } = body;

    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const phone10 = extractLast10Digits(phone);
    const whatsapp10 = extractLast10Digits(whatsappNo);

    if (!cleanEmail && !phone10 && !whatsapp10) {
      return NextResponse.json(
        { error: 'Please provide an email or phone number to check.' },
        { status: 400 }
      );
    }

    // 1. Check persistent database (client_base in Supabase kv_store & local disk)
    try {
      const clients = await readPersistentDataAsync<any[]>('client_base', []);

      if (cleanEmail) {
        const duplicateEmailClient = clients.find(
          (c) => c.email && c.email.toLowerCase().trim() === cleanEmail
        );
        if (duplicateEmailClient) {
          return NextResponse.json(
            {
              error: 'An account with this email address already exists. Please log in.',
              field: 'email',
              exists: true,
            },
            { status: 400 }
          );
        }
      }

      if (phone10) {
        const duplicatePhoneClient = clients.find((c) => {
          const cPhone10 = extractLast10Digits(c.phone);
          const cWhatsapp10 = extractLast10Digits(c.whatsappNo);
          return (phone10 && (cPhone10 === phone10 || cWhatsapp10 === phone10));
        });
        if (duplicatePhoneClient) {
          return NextResponse.json(
            {
              error: 'An account with this mobile number already exists. Please log in.',
              field: 'phone',
              exists: true,
            },
            { status: 400 }
          );
        }
      }

      if (whatsapp10 && whatsapp10 !== phone10) {
        const duplicateWhatsAppClient = clients.find((c) => {
          const cPhone10 = extractLast10Digits(c.phone);
          const cWhatsapp10 = extractLast10Digits(c.whatsappNo);
          return (cPhone10 === whatsapp10 || cWhatsapp10 === whatsapp10);
        });
        if (duplicateWhatsAppClient) {
          return NextResponse.json(
            {
              error: 'An account with this WhatsApp number already exists. Please log in.',
              field: 'whatsappNo',
              exists: true,
            },
            { status: 400 }
          );
        }
      }
    } catch (storeErr) {
      console.warn('Persistent store duplicate check notice:', storeErr);
    }

    // 2. Check Prisma PostgreSQL Database (if DATABASE_URL is configured)
    if (process.env.DATABASE_URL) {
      try {
        if (cleanEmail) {
          const existingUserByEmail = await prisma.user.findUnique({
            where: { email: cleanEmail },
          });
          if (existingUserByEmail) {
            return NextResponse.json(
              {
                error: 'An account with this email address already exists. Please log in.',
                field: 'email',
                exists: true,
              },
              { status: 400 }
            );
          }
        }

        if (phone10) {
          const existingUserByPhone = await prisma.user.findFirst({
            where: {
              OR: [
                { phone: { contains: phone10 } },
                { whatsappNo: { contains: phone10 } },
              ],
            },
          });
          if (existingUserByPhone) {
            return NextResponse.json(
              {
                error: 'An account with this mobile number already exists. Please log in.',
                field: 'phone',
                exists: true,
              },
              { status: 400 }
            );
          }
        }
      } catch (prismaErr) {
        console.warn('Prisma duplicate check notice:', prismaErr);
      }
    }

    return NextResponse.json({
      success: true,
      available: true,
      message: 'Mobile number and email address are available.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Duplicate check error' },
      { status: 500 }
    );
  }
}
