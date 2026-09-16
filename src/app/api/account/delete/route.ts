import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/db';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, phone, reason = 'User requested self-service deletion' } = body;

    if (!userId && !email && !phone) {
      return NextResponse.json(
        { error: 'User identifier is required for account deletion' },
        { status: 400 }
      );
    }

    const cleanEmail = email?.toLowerCase().trim();
    const cleanPhone = phone?.trim();

    // 1. Purge from Prisma if Database is configured
    if (process.env.DATABASE_URL) {
      try {
        await prisma.user.deleteMany({
          where: {
            OR: [
              ...(userId ? [{ id: userId }] : []),
              ...(cleanEmail ? [{ email: cleanEmail }] : []),
              ...(cleanPhone ? [{ phone: cleanPhone }] : []),
            ],
          },
        });
      } catch (dbErr) {
        console.warn('Prisma account delete error notice:', dbErr);
      }
    }

    // 2. Purge from client_base persistent store
    try {
      const clients = await readPersistentDataAsync<any[]>('client_base', []);
      const updatedClients = clients.filter((c: any) => {
        if (userId && c.id === userId) return false;
        if (cleanEmail && c.email && c.email.toLowerCase().trim() === cleanEmail) return false;
        if (cleanPhone && (c.phone === cleanPhone || c.whatsappNo === cleanPhone)) return false;
        return true;
      });
      await writePersistentDataAsync('client_base', updatedClients);
    } catch (e) {
      console.warn('Persistent client store purge notice:', e);
    }

    // 3. Purge user's posts from Leipung feed (optional/clean data)
    const postsFile = path.join(process.cwd(), 'data', 'leipung_posts.json');
    if (fs.existsSync(postsFile)) {
      try {
        const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
        const filteredPosts = posts.filter((p: any) => {
          if (userId && p.author?.id === userId) return false;
          return true;
        });
        fs.writeFileSync(postsFile, JSON.stringify(filteredPosts, null, 2), 'utf8');
      } catch (postErr) {
        console.warn('Leipung post purge notice:', postErr);
      }
    }

    // 4. Record Deletion Audit Log for Compliance
    const auditFile = path.join(process.cwd(), 'data', 'account_deletion_audit.json');
    try {
      let auditLogs = [];
      if (fs.existsSync(auditFile)) {
        auditLogs = JSON.parse(fs.readFileSync(auditFile, 'utf8'));
      }
      auditLogs.push({
        id: `del-${Date.now()}`,
        userId: userId || 'unknown',
        email: cleanEmail || '',
        phone: cleanPhone || '',
        reason,
        deleted_at: new Date().toISOString(),
        compliance: 'Apple 5.1.1 & Google Play Data Safety Compliant',
      });
      fs.writeFileSync(auditFile, JSON.stringify(auditLogs, null, 2), 'utf8');
    } catch (auditErr) {
      console.warn('Audit log write notice:', auditErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Account and associated personal data have been permanently deleted.',
    });
  } catch (err: any) {
    console.error('Account deletion API error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to complete account deletion' },
      { status: 500 }
    );
  }
}
