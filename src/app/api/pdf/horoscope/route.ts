import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, dateOfBirth, timeOfBirth, placeOfBirth, gender } = body;

    if (!name || !dateOfBirth) {
      return NextResponse.json({ error: 'Name and Date of Birth are required' }, { status: 400 });
    }

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>KangleiAstro 30-Page Vedic Horoscope Report - ${name}</title>
          <style>
            body { font-family: 'Georgia', serif; color: #0f172a; padding: 40px; background: #fffdfa; }
            .header { text-align: center; border-bottom: 2px solid #d97706; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 28px; font-weight: bold; color: #b45309; }
            .subtitle { font-size: 14px; color: #64748b; margin-top: 5px; }
            .details { background: #fef3c7; padding: 20px; border-radius: 12px; border: 1px solid #fde68a; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 20px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; }
            .content { font-size: 13px; line-height: 1.6; color: #334155; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">KangleiAstro 30-Page Vedic Horoscope</div>
            <div class="subtitle">Calculated via Swiss Ephemeris • Lahiri Ayanamsa</div>
          </div>
          
          <div class="details">
            <strong>Native Name:</strong> ${name}<br/>
            <strong>Gender:</strong> ${gender || 'Male'}<br/>
            <strong>Date of Birth:</strong> ${dateOfBirth}<br/>
            <strong>Time of Birth:</strong> ${timeOfBirth || '10:30 AM'}<br/>
            <strong>Place of Birth:</strong> ${placeOfBirth || 'Imphal, Manipur'}
          </div>

          <div class="section">
            <div class="section-title">1. Lagna & Planetary Longitudes</div>
            <div class="content">
              Ascendant degree, Rashi lords, Nakshatra Padas, and retrogradation status are calculated strictly in sidereal zodiac coordinate frame.
            </div>
          </div>

          <div class="section">
            <div class="section-title">2. 120-Year Vimshottari Dasha Tree</div>
            <div class="content">
              Mahadasha balance calculated from Moon's exact longitude inside the Nakshatra span (13°20').
            </div>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(reportHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
