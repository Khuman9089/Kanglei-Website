import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export interface BannerAdConfig {
  active: boolean;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  theme: 'gold' | 'crimson' | 'emerald' | 'midnight';
}

let bannerAdState: BannerAdConfig = {
  active: true,
  title: '✨ Special Manipuri Astrological Offer',
  description: 'Get 20% OFF Kuthi Matching & Full 36-Gun Ashtakoot Compatibility Reports today!',
  imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&q=80',
  buttonText: 'Claim 20% Discount →',
  buttonLink: '/matching',
  theme: 'gold',
};

export async function GET() {
  return NextResponse.json({ banner: bannerAdState });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.banner) {
      bannerAdState = { ...bannerAdState, ...body.banner };
    }
    return NextResponse.json({ success: true, banner: bannerAdState });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update banner ad' }, { status: 500 });
  }
}
