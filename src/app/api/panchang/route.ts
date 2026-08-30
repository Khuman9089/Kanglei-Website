import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
import { calculateVedicPanchang } from '@/engine/panchang';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const lat = parseFloat(searchParams.get('lat') || '24.817'); // Imphal default
    const lng = parseFloat(searchParams.get('lng') || '93.936');
    const tzOffset = parseFloat(searchParams.get('tz') || '5.5');
    const locationName = searchParams.get('location') || 'Imphal, Manipur';

    const panchangData = calculateVedicPanchang(dateParam, lat, lng, tzOffset, locationName);

    return NextResponse.json({
      success: true,
      panchang: panchangData,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to calculate Panchang' }, { status: 500 });
  }
}
