import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export interface AstrologerInvite {
  token: string;
  name: string;
  phone: string;
  email: string;
  specialties?: string[];
  planTier?: 'BASIC' | 'ADVANCE' | 'PRO';
  used: boolean;
  usedAt?: string;
  createdAt: string;
  expiresAt: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ valid: false, reason: 'MISSING_TOKEN' }, { status: 400 });
    }

    const invites = await readPersistentDataAsync<AstrologerInvite[]>('astrologer_invites', []);
    const invite = invites.find((inv) => inv.token === token);

    if (!invite) {
      return NextResponse.json({ valid: false, reason: 'NOT_FOUND' }, { status: 404 });
    }

    if (invite.used) {
      return NextResponse.json({ 
        valid: false, 
        reason: 'ALREADY_USED',
        usedAt: invite.usedAt,
        message: 'This invitation link has already been used to register an account and is no longer valid.' 
      }, { status: 400 });
    }

    if (new Date(invite.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ 
        valid: false, 
        reason: 'EXPIRED',
        message: 'This invitation link has expired. Please request a new invite from the administrator.' 
      }, { status: 400 });
    }

    return NextResponse.json({ valid: true, invite });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Admin generates a new one-time invite token
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, specialties, planTier, expiryDays } = body;

    const randomBytes = crypto.randomBytes(16).toString('hex');
    const token = `inv_${Date.now()}_${randomBytes}`;
    const days = expiryDays && !isNaN(expiryDays) ? Number(expiryDays) : 7;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

    const newInvite: AstrologerInvite = {
      token,
      name: String(name || '').trim(),
      phone: String(phone || '').trim(),
      email: String(email || '').trim(),
      specialties: Array.isArray(specialties) ? specialties : ['Vedic Astrology', 'Manipuri Kuthi Yengba'],
      planTier: planTier || 'ADVANCE',
      used: false,
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    const invites = await readPersistentDataAsync<AstrologerInvite[]>('astrologer_invites', []);
    const updated = [newInvite, ...invites];
    await writePersistentDataAsync('astrologer_invites', updated);

    return NextResponse.json({
      success: true,
      invite: newInvite,
      message: 'One-time Astrologer invitation link generated successfully!',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Astrologer completes registration using the one-time token
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { token, name, phone, email, password, specialties, experienceYears, languages, bio, upiId } = body;

    if (!token) {
      return NextResponse.json({ error: 'Missing invitation token' }, { status: 400 });
    }

    if (!name || !phone || !password) {
      return NextResponse.json({ error: 'Please provide full name, mobile number, and password.' }, { status: 400 });
    }

    const invites = await readPersistentDataAsync<AstrologerInvite[]>('astrologer_invites', []);
    const invIdx = invites.findIndex((inv) => inv.token === token);

    if (invIdx === -1) {
      return NextResponse.json({ error: 'Invitation link does not exist.' }, { status: 404 });
    }

    const targetInvite = invites[invIdx];

    if (targetInvite.used) {
      return NextResponse.json({ 
        error: 'This invitation has already been used once. Each invite is strictly valid for a single registration.' 
      }, { status: 400 });
    }

    if (new Date(targetInvite.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: 'This invitation link has expired. Please contact administration.' }, { status: 400 });
    }

    // 1. Mark invite token as USED immediately
    invites[invIdx] = {
      ...targetInvite,
      used: true,
      usedAt: new Date().toISOString(),
    };
    await writePersistentDataAsync('astrologer_invites', invites);

    // 2. Add / Register Astrologer in directory
    const existingAstros = await readPersistentDataAsync<any[]>('astrologers_directory', []);
    const rawDigits = phone.replace(/\D/g, '');
    const astroId = `astro-${Date.now()}`;

    const newAstrologer = {
      id: astroId,
      name: String(name).trim(),
      phone: String(phone).trim(),
      whatsappNo: String(phone).trim(),
      whatsappPhone: String(phone).trim(),
      email: String(email || '').trim().toLowerCase(),
      password: String(password).trim(),
      specialty: Array.isArray(specialties) && specialties.length > 0 ? specialties[0] : 'Vedic Astrology',
      specialties: Array.isArray(specialties) && specialties.length > 0 ? specialties : ['Vedic Astrology', 'Kuthi Yengba'],
      experienceYears: Number(experienceYears || 5),
      languages: Array.isArray(languages) ? languages : ['Manipuri', 'English'],
      bio: String(bio || 'Certified Vedic Astrologer and Jyotish practitioner.').trim(),
      upiId: String(upiId || '').trim(),
      status: 'ACTIVE',
      active: true,
      online: true,
      rating: 5.0,
      pricePerMin: 30,
      fixedRate: 499,
      completedCount: 0,
      pendingPayout: 0,
      totalEarnings: 0,
      createdAt: new Date().toISOString(),
    };

    const updatedAstros = [newAstrologer, ...existingAstros.filter((a) => a.phone?.replace(/\D/g, '') !== rawDigits)];
    await writePersistentDataAsync('astrologers_directory', updatedAstros);

    return NextResponse.json({
      success: true,
      astrologer: newAstrologer,
      message: 'Account created successfully! Welcome to the KangleiAstro panel.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
