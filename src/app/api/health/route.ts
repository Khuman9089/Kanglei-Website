import { NextResponse } from 'next/server';
import { checkSupabaseConnection, supabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const connected = await checkSupabaseConnection();
  return NextResponse.json(
    {
      ok: connected,
      status: connected ? 'connected' : 'disconnected',
      supabaseConfigured,
      timestamp: new Date().toISOString(),
      message: connected
        ? 'Supabase connection verified — queries are reaching the database.'
        : supabaseConfigured
        ? 'Keys present but the query failed. Check the table exists (public.orders) and RLS policies.'
        : 'No Supabase keys in environment. Add NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY and redeploy.',
    },
    { status: connected ? 200 : 503 }
  );
}