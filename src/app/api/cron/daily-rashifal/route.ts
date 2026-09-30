import { NextResponse } from 'next/server';
import { getOrGenerateDailyRashifal } from '@/lib/dailyRashifal';
import { publishDailyRashifalToFacebook, getFacebookSettings } from '@/lib/facebookPublisher';

export const dynamic = 'force-dynamic';

function verifyCronAuth(req: Request): boolean {
  const cronSecret = process.env.CRON_SECRET || 'kuthiyengpham_rashifal_cron_secure_2026';
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  const { searchParams } = new URL(req.url);
  const querySecret = searchParams.get('secret');
  if (querySecret && querySecret === cronSecret) {
    return true;
  }

  // Also accept Vercel Cron header if hosted on Vercel
  const vercelCron = req.headers.get('x-vercel-cron');
  if (vercelCron) {
    return true;
  }

  return false;
}

export async function GET(req: Request) {
  return handleDailyCron(req);
}

export async function POST(req: Request) {
  return handleDailyCron(req);
}

async function handleDailyCron(req: Request) {
  try {
    const isAuthorized = verifyCronAuth(req);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Provide valid Bearer token or secret.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date') || undefined;
    const forceRefresh = searchParams.get('refresh') === 'true';
    const skipFacebook = searchParams.get('skip_fb') === 'true';

    console.log(`[Cron daily-rashifal] Starting daily automation for date: ${dateParam || 'today'}...`);

    // 1. Generate or retrieve today's rashifal
    const rashifal = await getOrGenerateDailyRashifal(dateParam, forceRefresh);
    console.log(`[Cron daily-rashifal] Generated ${rashifal.items.length} signs (source: ${rashifal.source})`);

    // 2. Check Facebook settings
    const fbSettings = await getFacebookSettings();
    let fbResult: any = { skipped: true, reason: 'Facebook auto-post disabled or skipped' };

    if (!skipFacebook && fbSettings.autoPostEnabled) {
      console.log('[Cron daily-rashifal] Triggering auto-post to Facebook Page...');
      fbResult = await publishDailyRashifalToFacebook(rashifal);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      date: rashifal.date,
      formattedDate: rashifal.formattedDate,
      signsCount: rashifal.items.length,
      source: rashifal.source,
      facebook: fbResult
    });
  } catch (error: any) {
    console.error('[Cron daily-rashifal] Critical failure:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Daily cron execution failed' },
      { status: 500 }
    );
  }
}
