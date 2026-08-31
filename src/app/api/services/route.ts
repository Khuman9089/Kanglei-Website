import { NextResponse } from 'next/server';
import { readPersistentData, writePersistentData } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export interface SubServiceItem {
  id: string;
  title: string;
  price: number;
  description?: string;
}

export interface ServiceItem {
  id: string;
  badge?: string;
  title: string;
  description?: string;
  features?: string[];
  price?: string;
  cta?: string;
  link?: string;
  active: boolean;
  subServices: SubServiceItem[];
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 's-1',
    badge: 'Popular',
    title: 'Kuthi Yengba (Horoscope Analysis & Remedies)',
    description: 'In-depth analysis of natal Kundali, Vimshottari Dasha, planetary transits, and customized Manipuri Vedic remedies.',
    features: [
      'D1 Rashi & D9 Navamsha chart analysis',
      'Favorable promotion & job change windows',
      'Personalized wealth accumulation remedies',
    ],
    price: '₹499',
    cta: 'Order Kuthi Yengba',
    link: '/manipuri_kuthi_yengba',
    active: true,
    subServices: [
      {
        id: 'sub-101',
        title: 'Standard Kuthi Yengba (Detailed Dasha & Remedies)',
        price: 499,
        description: 'Complete analysis delivered to your WhatsApp within 12 Hours.',
      },
      {
        id: 'sub-102',
        title: 'Express Fast-Track Kuthi Yengba (Delivered within 4 Hours)',
        price: 799,
        description: 'Priority queue processing delivered within 4 Hours.',
      },
      {
        id: 'sub-103',
        title: 'Comprehensive 5-Year Life Roadmap Kuthi Report',
        price: 1199,
        description: 'Full 5-year planetary transit timeline and personalized remedies PDF.',
      },
    ],
  },
  {
    id: 's-2',
    badge: 'Traditional',
    title: 'Kuthi Iba (Handwritten Kuthi Creation - কুঠি ইবা)',
    description: 'Authentic hand-written Kuthi birth scroll prepared on sacred parchment by experienced Vedic Acharyas.',
    features: [
      'Handwritten D1 Rashi & D9 Navamsha charts',
      'Consecrated with sacred Vedic Mantras',
      'Physical home delivery across Manipur & India',
    ],
    price: '₹899',
    cta: 'Order Kuthi Iba',
    link: '/manipuri_kuthi_yengba?service=s-2',
    active: true,
    subServices: [
      {
        id: 'sub-201',
        title: 'Standard Handwritten Kuthi Paper (Single Child)',
        price: 899,
        description: 'Traditional handwritten birth scroll on sacred parchment.',
      },
      {
        id: 'sub-202',
        title: 'Premium Gold-Stamped Traditional Kuthi Scroll',
        price: 1499,
        description: 'Deluxe gold-bordered scroll in protective sacred case.',
      },
    ],
  },
  {
    id: 's-3',
    badge: 'High Accuracy',
    title: 'Pakna Wainaba Yengba (Kundli Matching & 36-Gun Milan)',
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
    subServices: [
      {
        id: 'sub-301',
        title: '36-Gun Ashtakoot Match & Manglik Check',
        price: 1299,
        description: 'Detailed 36-point compatibility report for couple pair.',
      },
      {
        id: 'sub-302',
        title: 'Full D9 Navamsha Couple Compatibility & Remedial Report',
        price: 1999,
        description: 'Comprehensive marriage compatibility with specific remedial pujas.',
      },
    ],
  },
  {
    id: 's-4',
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
    link: '/manipuri_kuthi_yengba?service=s-4',
    active: true,
    subServices: [
      {
        id: 'sub-401',
        title: '30-Minute Video/Phone Session',
        price: 1499,
        description: 'Direct 30-minute consultation with Master Astrologer.',
      },
      {
        id: 'sub-402',
        title: '60-Minute Deep Consultation + Recorded Session & PDF Remedies',
        price: 2499,
        description: 'Full 60-minute session with recorded audio and written PDF remedies.',
      },
    ],
  },
];

export async function GET() {
  const services = readPersistentData<ServiceItem[]>('services', DEFAULT_SERVICES);
  return NextResponse.json({ services });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (Array.isArray(body.services)) {
      writePersistentData<ServiceItem[]>('services', body.services);
      return NextResponse.json({
        success: true,
        message: 'Service & Pricing settings saved successfully!',
        services: body.services,
      });
    }
    return NextResponse.json({ error: 'Invalid services array' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
