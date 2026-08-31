import fs from 'fs';
import path from 'path';

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
 * Falls back to defaultValue if file does not exist.
 */
export function readPersistentData<T>(key: string, defaultValue: T): T {
  ensureDataDirExists();
  const filePath = path.join(DATA_DIR, `${key}.json`);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.trim()) {
        return JSON.parse(content) as T;
      }
    }
    // If file doesn't exist, write fallback defaults to seed the file
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
    return defaultValue;
  } catch (err) {
    console.error(`Error reading persistent key "${key}":`, err);
    return defaultValue;
  }
}

/**
 * Write persistent JSON data for a given key.
 */
export function writePersistentData<T>(key: string, data: T): boolean {
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
