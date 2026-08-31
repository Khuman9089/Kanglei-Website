import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

// Local disk data folder path
const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDirExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

/**
 * Read persistent JSON data for a given key.
 * 1. Checks Supabase cloud table `kv_store` first if connected.
 * 2. Falls back to local disk `data/${key}.json`.
 * 3. Falls back to defaultValue.
 */
export async function readPersistentDataAsync<T>(key: string, defaultValue: T): Promise<T> {
  // 1. Try fetching from Supabase cloud database
  try {
    const { data, error } = await supabase
      .from('kv_store')
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (!error && data && data.value !== undefined && data.value !== null) {
      // Sync back to local file system cache
      writePersistentDataLocal(key, data.value);
      return data.value as T;
    }
  } catch (cloudErr) {
    // Silent fallback to local disk
  }

  // 2. Fallback to local disk file system
  return readPersistentDataLocal(key, defaultValue);
}

/**
 * Synchronous local disk reader
 */
export function readPersistentData<T>(key: string, defaultValue: T): T {
  return readPersistentDataLocal(key, defaultValue);
}

function readPersistentDataLocal<T>(key: string, defaultValue: T): T {
  ensureDataDirExists();
  const filePath = path.join(DATA_DIR, `${key}.json`);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.trim()) {
        return JSON.parse(content) as T;
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
    return defaultValue;
  } catch (err) {
    console.error(`Error reading persistent key "${key}":`, err);
    return defaultValue;
  }
}

/**
 * Write persistent JSON data for a given key.
 * Writes to both local disk and Supabase cloud database (`kv_store`).
 */
export async function writePersistentDataAsync<T>(key: string, data: T): Promise<boolean> {
  // 1. Write to local disk file
  writePersistentDataLocal(key, data);

  // 2. Write to Supabase cloud database for zero-loss deployment resilience
  try {
    const { error } = await supabase
      .from('kv_store')
      .upsert({ key, value: data, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) {
      console.warn(`Supabase kv_store upsert notice for key "${key}":`, error.message);
    }
  } catch (cloudErr) {
    console.warn(`Cloud save fallback for key "${key}":`, cloudErr);
  }

  return true;
}

export function writePersistentData<T>(key: string, data: T): boolean {
  writePersistentDataLocal(key, data);

  // Fire-and-forget background cloud sync to Supabase
  supabase
    .from('kv_store')
    .upsert({ key, value: data, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    .then(({ error }) => {
      if (error) console.warn(`Background kv_store sync for "${key}":`, error.message);
    })
    .catch(() => {});

  return true;
}

function writePersistentDataLocal<T>(key: string, data: T): boolean {
  ensureDataDirExists();
  const filePath = path.join(DATA_DIR, `${key}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing persistent key "${key}":`, err);
    return false;
  }
}
