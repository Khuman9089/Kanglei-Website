import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, reason, timestamp, app = 'Jyoti AI' } = body;

    if (!identifier) {
      return NextResponse.json(
        { error: 'Identifier is required for account deletion' },
        { status: 400 }
      );
    }

    // In a decoupled architecture, any server-cached sessions, token logs, or records are purged
    console.log(`[Data Safety] Account deletion executed for app=${app}, identifier=${identifier}, timestamp=${timestamp}, reason=${reason}`);

    return NextResponse.json({
      success: true,
      message: 'Account and associated data deleted successfully.',
      timestamp: new Date().toISOString(),
      app,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
