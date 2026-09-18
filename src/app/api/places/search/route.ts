import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('query') || searchParams.get('q') || '').trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_PLACES_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

    // 1. If Google Maps / Places API key is configured, query Google APIs
    if (apiKey) {
      try {
        // Strategy 1A: Google Places TextSearch API (Best for places, hospitals, localities)
        const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          query
        )}&key=${apiKey}`;

        const pRes = await fetch(placesUrl);
        const pData = await pRes.json();

        if (pData.status === 'OK' && pData.results && pData.results.length > 0) {
          const results = pData.results.slice(0, 8).map((item: any) => ({
            name: item.formatted_address || item.name,
            latitude: parseFloat(item.geometry.location.lat.toFixed(4)),
            longitude: parseFloat(item.geometry.location.lng.toFixed(4)),
            source: 'google',
            type: item.types?.includes('hospital') ? 'hospital' : 'locality',
          }));
          return NextResponse.json({ results, provider: 'google_places' });
        } else if (pData.status && pData.status !== 'ZERO_RESULTS') {
          console.warn('[Places API] Google Places TextSearch status:', pData.status, pData.error_message || '');
        }

        // Strategy 1B: Google Geocoding API (Best for addresses, cities, districts)
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          query
        )}&key=${apiKey}`;

        const gRes = await fetch(geocodeUrl);
        const gData = await gRes.json();

        if (gData.status === 'OK' && gData.results && gData.results.length > 0) {
          const results = gData.results.slice(0, 8).map((item: any) => ({
            name: item.formatted_address,
            latitude: parseFloat(item.geometry.location.lat.toFixed(4)),
            longitude: parseFloat(item.geometry.location.lng.toFixed(4)),
            source: 'google',
            type: item.types?.includes('hospital') ? 'hospital' : 'locality',
          }));
          return NextResponse.json({ results, provider: 'google_geocode' });
        } else if (gData.status && gData.status !== 'ZERO_RESULTS') {
          console.warn('[Places API] Google Geocoding status:', gData.status, gData.error_message || '');
        }
      } catch (gErr) {
        console.error('[Places API] Google Maps API fetch error:', gErr);
      }
    }

    // 2. OpenStreetMap / Nominatim high-accuracy fallback
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
        return NextResponse.json({ results, provider: 'osm' });
      }

      // Nominatim Regional fallback
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
        return NextResponse.json({ results, provider: 'osm' });
      }
    } catch (nomErr) {
      console.error('[Places API] Nominatim API Error:', nomErr);
    }

    return NextResponse.json({ results: [], provider: 'none' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Location search error' }, { status: 500 });
  }
}

