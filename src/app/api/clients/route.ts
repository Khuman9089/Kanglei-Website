import { NextResponse } from 'next/server';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsappNo: string;
  sex: 'Male' | 'Female' | 'Other';
  address: string;
  role: 'CLIENT';
  joinedAt: string;
  totalOrders: number;
  totalSpent: number;
  savedKundlisCount: number;
  status: 'ACTIVE' | 'VERIFIED' | 'SUSPENDED';
}

const DEFAULT_CLIENTS: ClientUser[] = [];

export async function GET() {
  const clients = await readPersistentDataAsync<ClientUser[]>('client_base', DEFAULT_CLIENTS);
  return NextResponse.json({ success: true, clients });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let clients = await readPersistentDataAsync<ClientUser[]>('client_base', DEFAULT_CLIENTS);

    if (body.action === 'REGISTER_CLIENT' || body.action === 'SAVE_CLIENT') {
      const client: ClientUser = body.client;
      const idx = clients.findIndex((c) => c.id === client.id || (c.email && c.email === client.email));
      if (idx !== -1) {
        clients[idx] = { ...clients[idx], ...client };
      } else {
        clients.unshift(client);
      }
      await writePersistentDataAsync('client_base', clients);
      return NextResponse.json({ success: true, message: 'Client saved live!', clients });
    }

    if (body.action === 'DELETE_CLIENT') {
      clients = clients.filter((c) => c.id !== body.id);
      await writePersistentDataAsync('client_base', clients);
      return NextResponse.json({ success: true, message: 'Client removed.', clients });
    }

    if (body.clients && Array.isArray(body.clients)) {
      clients = body.clients;
      await writePersistentDataAsync('client_base', clients);
      return NextResponse.json({ success: true, clients });
    }

    return NextResponse.json({ success: true, clients });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
