import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

// Local disk data folder path
const DATA_DIR = path.join(process.cwd(), 'data');

// In-memory runtime cache for high-speed zero-loss reads across SSR and API requests
const memoryCache = new Map<string, any>();

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
 * 1. Checks Supabase cloud table `kv_store` first for multi-instance / deploy persistence.
 * 2. Checks in-memory server cache.
 * 3. Checks local disk `data/${key}.json`.
 * 4. Falls back to defaultValue only if no previous configuration exists.
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
      memoryCache.set(key, data.value);
      // Sync back to local file system cache
      writePersistentDataLocal(key, data.value);
      return data.value as T;
    }
  } catch (cloudErr) {
    // Silent fallback
  }

  // 2. Check in-memory runtime cache
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }

  // 3. Fallback to local disk file system
  ensureDataDirExists();
  const filePath = path.join(DATA_DIR, `${key}.json`);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.trim()) {
        const parsed = JSON.parse(content) as T;
        memoryCache.set(key, parsed);
        return parsed;
      }
    }
    // Only write default if file didn't exist at all
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
    memoryCache.set(key, defaultValue);
    return defaultValue;
  } catch (err) {
    console.error(`Error reading persistent key "${key}":`, err);
    return defaultValue;
  }
}

/**
 * Synchronous local disk reader with memory cache
 */
export function readPersistentData<T>(key: string, defaultValue: T): T {
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }
  return readPersistentDataLocal(key, defaultValue);
}

function readPersistentDataLocal<T>(key: string, defaultValue: T): T {
  ensureDataDirExists();
  const filePath = path.join(DATA_DIR, `${key}.json`);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.trim()) {
        const parsed = JSON.parse(content) as T;
        memoryCache.set(key, parsed);
        return parsed;
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
    memoryCache.set(key, defaultValue);
    return defaultValue;
  } catch (err) {
    console.error(`Error reading persistent key "${key}":`, err);
    return defaultValue;
  }
}

/**
 * Write persistent JSON data for a given key.
 * Writes to memory cache, local disk, and Supabase cloud database (`kv_store`).
 */
export async function writePersistentDataAsync<T>(key: string, data: T): Promise<boolean> {
  // 1. Update in-memory runtime cache
  memoryCache.set(key, data);

  // 2. Write to local disk file
  writePersistentDataLocal(key, data);

  // 3. Write to Supabase cloud database for zero-loss deployment resilience
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
  memoryCache.set(key, data);
  writePersistentDataLocal(key, data);

  // Fire-and-forget background cloud sync to Supabase
  (async () => {
    try {
      const { error } = await supabase
        .from('kv_store')
        .upsert({ key, value: data, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      if (error) console.warn(`Background kv_store sync for "${key}":`, error.message);
    } catch (err) {
      // Silent catch for background sync
    }
  })();

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
