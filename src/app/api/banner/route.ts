import { NextResponse } from 'next/server';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export interface BannerAdConfig {
  active: boolean;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  theme: 'gold' | 'crimson' | 'emerald' | 'midnight';
}

const DEFAULT_BANNER: BannerAdConfig = {
  active: true,
  title: '✨ Special Manipuri Astrological Offer',
  description: 'Get 20% OFF Kuthi Matching & Full 36-Gun Ashtakoot Compatibility Reports today!',
  imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&q=80',
  buttonText: 'Claim 20% Discount →',
  buttonLink: '/matching',
  theme: 'gold',
};

export async function GET() {
  const banner = await readPersistentDataAsync<BannerAdConfig>('banner', DEFAULT_BANNER);
  return NextResponse.json({ banner });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let currentBanner = await readPersistentDataAsync<BannerAdConfig>('banner', DEFAULT_BANNER);
    if (body.banner) {
      currentBanner = { ...currentBanner, ...body.banner };
      await writePersistentDataAsync('banner', currentBanner);
    }
    return NextResponse.json({ success: true, banner: currentBanner });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update banner ad' }, { status: 500 });
  }
}
