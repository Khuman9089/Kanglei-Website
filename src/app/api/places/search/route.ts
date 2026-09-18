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
        // First try Geocoding with full query
        const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          query
        )}&key=${apiKey}`;

        const res = await fetch(googleUrl);
        const data = await res.json();

        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const results = data.results.slice(0, 8).map((item: any) => ({
            name: item.formatted_address,
            latitude: parseFloat(item.geometry.location.lat.toFixed(4)),
            longitude: parseFloat(item.geometry.location.lng.toFixed(4)),
            source: 'google',
            type: item.types?.includes('hospital') ? 'hospital' : 'locality',
          }));
          return NextResponse.json({ results });
        }

        // If zero results, try with Manipur / India context
        const googleManipurUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          query + ', Manipur, India'
        )}&key=${apiKey}`;
        const resM = await fetch(googleManipurUrl);
        const dataM = await resM.json();

        if (dataM.status === 'OK' && dataM.results && dataM.results.length > 0) {
          const results = dataM.results.slice(0, 8).map((item: any) => ({
            name: item.formatted_address,
            latitude: parseFloat(item.geometry.location.lat.toFixed(4)),
            longitude: parseFloat(item.geometry.location.lng.toFixed(4)),
            source: 'google',
            type: item.types?.includes('hospital') ? 'hospital' : 'locality',
          }));
          return NextResponse.json({ results });
        }
      } catch (gErr) {
        console.error('Google Maps API Error:', gErr);
      }
    }

    // 2. OpenStreetMap / Nominatim fallback
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&limit=8`;

      const nomRes = await fetch(nomUrl, {
        headers: {
          'User-Agent': 'KangleiAstro-App/1.0 (contact@kuthiyengpham.in)',
        },
      });
      const nomData = await nomRes.json();

      if (Array.isArray(nomData) && nomData.length > 0) {
        const results = nomData.map((item: any) => ({
          name: item.display_name.split(',').slice(0, 4).join(',').trim(),
          latitude: parseFloat(parseFloat(item.lat).toFixed(4)),
          longitude: parseFloat(parseFloat(item.lon).toFixed(4)),
          source: 'osm',
          type: item.type === 'hospital' ? 'hospital' : 'locality',
        }));
        return NextResponse.json({ results });
      }

      // Nominatim Manipur fallback
      const nomManipurUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query + ', Manipur, India'
      )}&format=json&limit=8`;
      const nomManRes = await fetch(nomManipurUrl, {
        headers: {
          'User-Agent': 'KangleiAstro-App/1.0 (contact@kuthiyengpham.in)',
        },
      });
      const nomManData = await nomManRes.json();
      if (Array.isArray(nomManData) && nomManData.length > 0) {
        const results = nomManData.map((item: any) => ({
          name: item.display_name.split(',').slice(0, 4).join(',').trim(),
          latitude: parseFloat(parseFloat(item.lat).toFixed(4)),
          longitude: parseFloat(parseFloat(item.lon).toFixed(4)),
          source: 'osm',
          type: item.type === 'hospital' ? 'hospital' : 'locality',
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

