import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iiukspgbyhbuodpgdjuh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
