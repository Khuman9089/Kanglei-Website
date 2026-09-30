import { NextResponse } from 'next/server';
import { getOrGenerateDailyRashifal } from '@/lib/dailyRashifal';
import {
  publishDailyRashifalToFacebook,
  getFacebookSettings,
  saveFacebookSettings,
  getFacebookPostHistory
} from '@/lib/facebookPublisher';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getFacebookSettings();
    const history = await getFacebookPostHistory();

    // Redact token for security in display
    const maskedToken = settings.accessToken
      ? `${settings.accessToken.slice(0, 10)}...${settings.accessToken.slice(-8)}`
      : 'Not configured';

    return NextResponse.json({
      success: true,
      settings: {
        pageId: settings.pageId,
        accessTokenMasked: maskedToken,
        hasAccessToken: Boolean(settings.accessToken),
        autoPostEnabled: settings.autoPostEnabled,
        lastPostedDate: settings.lastPostedDate,
        lastPostId: settings.lastPostId
      },
      history: history.slice(0, 10)
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const date = body?.date || undefined;

    // 1. Get rashifal
    const rashifal = await getOrGenerateDailyRashifal(date);

    // 2. Publish to Facebook
    const postResult = await publishDailyRashifalToFacebook(rashifal);

    return NextResponse.json({
      success: postResult.success,
      postId: postResult.postId,
      error: postResult.error,
      date: rashifal.date,
      messagePreview: postResult.messagePreview
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { pageId, accessToken, autoPostEnabled } = body;

    const updated = await saveFacebookSettings({
      ...(pageId ? { pageId: String(pageId).trim() } : {}),
      ...(accessToken ? { accessToken: String(accessToken).trim() } : {}),
      ...(autoPostEnabled !== undefined ? { autoPostEnabled: Boolean(autoPostEnabled) } : {})
    });

    return NextResponse.json({
      success: true,
      message: 'Facebook settings updated successfully',
      settings: {
        pageId: updated.pageId,
        autoPostEnabled: updated.autoPostEnabled,
        hasAccessToken: Boolean(updated.accessToken)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
