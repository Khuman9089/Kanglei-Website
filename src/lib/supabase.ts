import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iiukspgbyhbuodpgdjuh.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

export const supabaseConfigured = !!supabaseAnonKey;

let lazyClient: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!supabaseAnonKey) {
    throw new Error(
      'Supabase is not configured: set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY in your environment.'
    );
  }
  if (!lazyClient) {
    lazyClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return lazyClient;
}

/**
 * Lazy Supabase client: createClient() is deferred until the first actual query,
 * so importing this module never throws when env keys are absent (e.g. during build).
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    const client = getClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('orders').select('count', { count: 'exact', head: true });
    if (error) {
      console.warn('Supabase connection warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase connection check failed:', err);
    return false;
  }
}