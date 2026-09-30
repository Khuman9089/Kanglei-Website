import { NextResponse } from 'next/server';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';
import { AstroAIConfig, DEFAULT_ASTROAI_CONFIG } from '@/app/astroai/types/config';

export const dynamic = 'force-dynamic';

export type { AstroAIConfig };
export { DEFAULT_ASTROAI_CONFIG };

const CONFIG_KEY = 'astroai_config';

export async function GET() {
  try {
    const config = await readPersistentDataAsync<AstroAIConfig>(CONFIG_KEY, DEFAULT_ASTROAI_CONFIG);
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    console.error('Error fetching AstroAI config:', error);
    return NextResponse.json({ success: false, config: DEFAULT_ASTROAI_CONFIG, error: error.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const current = await readPersistentDataAsync<AstroAIConfig>(CONFIG_KEY, DEFAULT_ASTROAI_CONFIG);

    const updatedConfig: AstroAIConfig = {
      ...current,
      ...body,
      admob: {
        ...current.admob,
        ...(body.admob || {}),
      },
      googleMaps: {
        ...current.googleMaps,
        ...(body.googleMaps || {}),
      },
      features: {
        ...current.features,
        ...(body.features || {}),
      },
      announcement: {
        ...current.announcement,
        ...(body.announcement || {}),
      },
      updatedAt: new Date().toISOString(),
    };

    const saved = await writePersistentDataAsync(CONFIG_KEY, updatedConfig);
    return NextResponse.json({ success: saved, config: updatedConfig });
  } catch (error: any) {
    console.error('Error updating AstroAI config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
