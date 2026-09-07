import { NextResponse } from 'next/server';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
}

export async function GET() {
  try {
    const inquiries = await readPersistentDataAsync<ContactInquiry[]>('contact_inquiries', []);
    return NextResponse.json({ inquiries });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !message || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Please provide your name, message, and at least an email or phone number.' },
        { status: 400 }
      );
    }

    const ticketId = `INQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInquiry: ContactInquiry = {
      id: ticketId,
      name: name.trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'NEW',
    };

    const inquiries = await readPersistentDataAsync<ContactInquiry[]>('contact_inquiries', []);
    const updated = [newInquiry, ...inquiries];
    await writePersistentDataAsync('contact_inquiries', updated);

    return NextResponse.json({
      success: true,
      ticketId,
      message: 'Your message has been received. Our team will contact you shortly.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
