import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export interface TickerItem {
  id: string;
  name: string;
  place: string;
  action: string;
  time: string;
}

export interface TickerSettings {
  active: boolean;
  speedSeconds: number; // Duration in seconds (higher = slower marquee)
  items: TickerItem[];
}

let tickerStore: TickerSettings = {
  active: true,
  speedSeconds: 65, // Slower, readable default marquee speed
  items: [
    { id: 't-1', name: 'Nganba', place: 'Imphal West', action: 'just started a consultation with Acharya Tombi Sharma', time: '2 min ago' },
    { id: 't-2', name: 'Thoibi', place: 'Thoubal', action: 'booked Kuthi Matching report with Pandit Ningthem Meitei', time: 'just now' },
    { id: 't-3', name: 'Ibomcha', place: 'Bishnupur', action: 'got his Vimshottari Dasha read by Gurumayum Sharma', time: '4 min ago' },
    { id: 't-4', name: 'Yaiphabi', place: 'Imphal East', action: 'generated her 30-Page Free Kundli Report', time: '1 min ago' },
    { id: 't-5', name: 'Laishram Rajen', place: 'Kakching', action: 'booked Rahu Dasha remedies with Acharya Tombi', time: '3 min ago' },
    { id: 't-6', name: 'Chingkhei', place: 'Churachandpur', action: 'consulted on 36-Gun Ashtakoot Milan with Saanvi Sharma', time: '5 min ago' },
    { id: 't-7', name: 'Sanatombi', place: 'Senapati', action: 'booked Sade Sati Gemstone consultation with Pt. Ram Naresh', time: 'just now' },
    { id: 't-8', name: 'Premkumar', place: 'Ukhrul', action: 'got his Career Horoscope reading from Acharya Tombi', time: '6 min ago' },
  ],
};

export async function GET() {
  return NextResponse.json({ ticker: tickerStore });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.ticker) {
      tickerStore = {
        ...tickerStore,
        ...body.ticker,
      };
    }
    return NextResponse.json({ success: true, ticker: tickerStore });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update ticker settings' }, { status: 500 });
  }
}
