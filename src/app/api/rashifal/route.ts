import { NextResponse } from 'next/server';
import { getOrGenerateDailyRashifal } from '@/lib/dailyRashifal';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || undefined;
    const forceRefresh = searchParams.get('refresh') === 'true';

    const rashifal = await getOrGenerateDailyRashifal(date, forceRefresh);

    return NextResponse.json({
      success: true,
      data: rashifal
    });
  } catch (error: any) {
    console.error('[API /api/rashifal] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch daily rashifal' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const date = body?.date || undefined;

    const rashifal = await getOrGenerateDailyRashifal(date, true);

    return NextResponse.json({
      success: true,
      message: 'Daily rashifal regenerated successfully',
      data: rashifal
    });
  } catch (error: any) {
    console.error('[API /api/rashifal POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to regenerate daily rashifal' },
      { status: 500 }
    );
  }
}
