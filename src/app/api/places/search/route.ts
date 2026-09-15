import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('query') || searchParams.get('q') || '').trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // 1. If Google Maps API key is configured, query Google Places / Geocoding API
    if (apiKey) {
      try {
        const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          query + ', Manipur, India'
        )}&bounds=23.8,93.0|25.7,94.8&components=country:IN&key=${apiKey}`;

        const res = await fetch(googleUrl);
        const data = await res.json();

        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const results = data.results.slice(0, 6).map((item: any) => ({
            name: item.formatted_address,
            latitude: parseFloat(item.geometry.location.lat.toFixed(4)),
            longitude: parseFloat(item.geometry.location.lng.toFixed(4)),
            source: 'google',
            type: item.types?.includes('hospital') ? 'hospital' : 'locality'
          }));
          return NextResponse.json({ results });
        }
      } catch (gErr) {
        console.error('Google Maps API Error:', gErr);
      }
    }

    // 2. OpenStreetMap / Nominatim fallback with Manipur bounding box
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query + ', Manipur, India'
      )}&format=json&viewbox=93.0,25.7,94.8,23.8&bounded=1&limit=6`;

      const nomRes = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'KangleiAstro-Manipur-App/1.0'
        }
      });
      const nomData = await nomRes.json();

      if (Array.isArray(nomData) && nomData.length > 0) {
        const results = nomData.map((item: any) => ({
          name: item.display_name.split(',').slice(0, 3).join(',').trim(),
          latitude: parseFloat(parseFloat(item.lat).toFixed(4)),
          longitude: parseFloat(parseFloat(item.lon).toFixed(4)),
          source: 'osm',
          type: item.type === 'hospital' ? 'hospital' : 'locality'
        }));
        return NextResponse.json({ results });
      }
    } catch (nomErr) {
      console.error('Nominatim API Error:', nomErr);
    }

    return NextResponse.json({ results: [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Location search error' }, { status: 500 });
  }
}
