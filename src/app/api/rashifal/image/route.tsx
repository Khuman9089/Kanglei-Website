import { NextRequest } from 'next/server';
import { generateDailyRashifalImage } from '@/lib/rashifalImage';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date') || undefined;
    return generateDailyRashifalImage(dateParam);
  } catch (error: any) {
    console.error('[API rashifal/image] Error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
