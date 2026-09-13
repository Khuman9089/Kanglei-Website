import { NextResponse } from 'next/server';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';
import { DEFAULT_MOBILE_SECTIONS } from '@/components/admin/MobileAppLayoutBuilder';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_CONFIG = {
  showAdBanner: true,
  adTag: 'SPONSORED',
  adTitle: 'Ceylon Unheated Yellow Sapphires (Pukhraj)',
  adSubtitle: 'Lab Certified 100% Natural • Special Astrologer Partner Discount',
  adBannerUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
  stationCity: 'Imphal · 24.8°N',
  tithiText: 'Shukla Navami (নৱমী)',
  nakshatraText: 'Rohini (রোহিণী)',
  rahuKaalText: '16:30 – 18:00',
  pendingKuthiOrders: 4,
  activeLiveCalls: 1,
  walletBalance: 14850,
  isOnline: true,
  enabledEngines: {
    sadesati: true,
    manglik: true,
    kaalsarp: true,
    ngaaeeshing: true,
    matchmaking: true,
    yogas: true,
    yumsharol: true,
    kundali: true,
  },
  sections: DEFAULT_MOBILE_SECTIONS,
};

export async function GET() {
  try {
    let sections = await readPersistentDataAsync('mobile_layout_sections', DEFAULT_MOBILE_SECTIONS);
    if (!Array.isArray(sections) || sections.length === 0) {
      sections = DEFAULT_MOBILE_SECTIONS;
      await writePersistentDataAsync('mobile_layout_sections', DEFAULT_MOBILE_SECTIONS);
    }

    let config = await readPersistentDataAsync('mobile_customizer_config', DEFAULT_CONFIG);
    if (!config || typeof config !== 'object' || !config.adTitle) {
      config = { ...DEFAULT_CONFIG, sections };
      await writePersistentDataAsync('mobile_customizer_config', config);
    }

    return NextResponse.json({
      success: true,
      config: {
        ...config,
        sections: Array.isArray(sections) && sections.length > 0 ? sections : DEFAULT_MOBILE_SECTIONS,
      },
      sections: Array.isArray(sections) && sections.length > 0 ? sections : DEFAULT_MOBILE_SECTIONS,
    });
  } catch (error: any) {
    console.error('Error fetching mobile config:', error);
    return NextResponse.json({
      success: true,
      config: DEFAULT_CONFIG,
      sections: DEFAULT_MOBILE_SECTIONS,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { config, sections } = body;

    let savedConfig = false;
    let savedSections = false;

    if (config) {
      savedConfig = await writePersistentDataAsync('mobile_customizer_config', config);
    }
    if (sections) {
      savedSections = await writePersistentDataAsync('mobile_layout_sections', sections);
    }

    return NextResponse.json({
      success: true,
      savedConfig,
      savedSections,
      message: 'Mobile configuration & layout saved permanently to database and disk.',
    });
  } catch (error: any) {
    console.error('Error saving mobile config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
