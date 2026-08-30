import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export interface ServiceItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  cta: string;
  link: string;
  active: boolean;
}

// Global in-memory store for live persistence across admin edits & site views
let storedServices: ServiceItem[] = [
  {
    id: 's-1',
    badge: 'Popular',
    title: 'Career & Financial Outlook',
    description: 'In-depth analysis of job changes, business growth, wealth Yogas, and favorable timing for investments.',
    features: [
      'D1 Rashi & D10 Dasamsha chart analysis',
      'Favorable promotion & job change windows',
      'Personalized wealth accumulation remedies',
    ],
    price: '₹1,499',
    cta: 'Book Now',
    link: '/booking?service=express-consultation-30',
    active: true,
  },
  {
    id: 's-2',
    badge: 'High Accuracy',
    title: 'Marriage & Relationship Matching',
    description: 'Complete 36-Gun Ashtakoot Milan, Manglik Dosh analysis, and mental/emotional compatibility assessment.',
    features: [
      '36-Points Ashtakoot breakdown',
      'Manglik Dosh cancellation check',
      'Favorable marriage timing windows',
    ],
    price: '₹1,299',
    cta: 'Check Compatibility',
    link: '/matching',
    active: true,
  },
  {
    id: 's-3',
    badge: 'Best Value',
    title: '1-on-1 Live Master Consultation',
    description: 'Direct face-to-face video consultation with our Master Vedic Astrologer with instant remedial guidance.',
    features: [
      '60 Mins direct video/audio session',
      'Full 5-year Vimshottari Dasha forecast',
      'Recorded session & remedies PDF',
    ],
    price: '₹2,499',
    cta: 'Book Consultation',
    link: '/booking?service=comprehensive-consultation-60',
    active: true,
  },
  {
    id: 's-4',
    badge: 'Annual Report',
    title: 'Yearly Transit Outlook Report',
    description: 'Detailed 20+ page annual forecast covering major planetary transits (Saturn, Jupiter, Rahu-Ketu).',
    features: [
      'Month-by-month prediction breakdown',
      'Transit impact on natal Moon sign',
      'Gemstone & Mantra recommendations',
    ],
    price: '₹999',
    cta: 'Order Report',
    link: '/booking?service=comprehensive-horoscope-report',
    active: true,
  },
];

export async function GET() {
  return NextResponse.json({ services: storedServices });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (Array.isArray(body.services)) {
      storedServices = body.services;
      return NextResponse.json({
        success: true,
        message: 'Service & Pricing settings saved successfully!',
        services: storedServices,
      });
    }
    return NextResponse.json({ error: 'Invalid services array' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
