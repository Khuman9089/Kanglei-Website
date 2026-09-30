import { generateDailyRashifalImage } from '@/lib/rashifalImage';

export const runtime = 'nodejs';
export const alt = 'Ngasi gi Rashifal - KuthiYengpham';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return generateDailyRashifalImage();
}
