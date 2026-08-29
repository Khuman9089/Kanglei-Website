import { NextResponse } from 'next/server';

// Demo client accounts (matches signup mock store pattern)
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
  'thoibi@example.com': {
    id: 'client-2',
    name: 'Thoibi Ningthoujam',
    email: 'thoibi@example.com',
    phone: '+91 98561 88210',
    whatsappNo: '+91 98561 88210',
    sex: 'Female',
    address: 'Porompat, Imphal East, Manipur',
    role: 'CLIENT',
    joinedAt: '2026-03-22',
  },
};

// Demo astrologer accounts
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
  '+91 97740 33411': {
    id: 'astro-2',
    name: 'Pandit Ningthem Meitei',
    email: 'ningthem@kangleiastro.com',
    phone: '+91 97740 33411',
    whatsappNo: '+91 97740 33411',
    specialty: 'Marriage Compatibility & Dasha Remedies',
    completedCount: 98,
    pendingPayout: 2250,
    role: 'ASTROLOGER',
    joinedAt: '2024-09-05',
  },
  '+91 98561 77122': {
    id: 'astro-3',
    name: 'Guru Sanatomba',
    email: 'sanatomba@kangleiastro.com',
    phone: '+91 98561 77122',
    whatsappNo: '+91 98561 77122',
    specialty: 'Navamsha D9 Chart & Gemstone Analysis',
    completedCount: 64,
    pendingPayout: 1750,
    role: 'ASTROLOGER',
    joinedAt: '2025-01-18',
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

    // Demo password check (any password with 4+ chars works for demo)
    if (password.length < 4) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please try again.' },
        { status: 401 }
      );
    }

    if (role === 'ASTROLOGER') {
      // Astrologer login by phone number
      const astro = DEMO_ASTROLOGERS[identifier] || DEMO_ASTROLOGERS[identifier.trim()];
      if (!astro) {
        return NextResponse.json(
          { error: 'Astrologer not found. Please use your registered phone number.' },
          { status: 401 }
        );
      }
      return NextResponse.json({
        success: true,
        user: astro,
        redirectTo: '/dashboard/astrologer',
      });
    } else {
      // Client login by email
      const client = DEMO_CLIENTS[identifier.toLowerCase().trim()];
      if (!client) {
        // Allow any email to login as a new demo client
        return NextResponse.json({
          success: true,
          user: {
            id: 'client-' + Date.now(),
            name: identifier.split('@')[0] || 'Client',
            email: identifier.toLowerCase().trim(),
            phone: '+91 00000 00000',
            whatsappNo: '+91 00000 00000',
            sex: 'Male',
            address: 'Imphal, Manipur',
            role: 'CLIENT',
            joinedAt: new Date().toISOString().split('T')[0],
          },
          redirectTo: '/dashboard/client',
        });
      }
      return NextResponse.json({
        success: true,
        user: client,
        redirectTo: '/dashboard/client',
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
