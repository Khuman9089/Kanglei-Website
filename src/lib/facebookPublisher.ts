import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';
import { DailyRashifalData } from '@/lib/dailyRashifal';
import { generateDailyRashifalImage } from '@/lib/rashifalImage';

export interface FacebookSettings {
  pageId: string;
  accessToken: string;
  autoPostEnabled: boolean;
  lastPostedDate?: string;
  lastPostId?: string;
}

export interface FacebookPostRecord {
  id: string;
  date: string;
  postId?: string;
  status: 'success' | 'failed';
  error?: string;
  postedAt: string;
  messagePreview: string;
}

const DEFAULT_PAGE_ID = process.env.FB_PAGE_ID || '1266050243267287';
const DEFAULT_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN || '';

export async function getFacebookSettings(): Promise<FacebookSettings> {
  const settings = await readPersistentDataAsync<FacebookSettings>('fb_settings', {
    pageId: DEFAULT_PAGE_ID,
    accessToken: DEFAULT_ACCESS_TOKEN,
    autoPostEnabled: true
  });

  // Ensure env fallback if persistent store doesn't have it yet
  if (!settings.pageId && process.env.FB_PAGE_ID) {
    settings.pageId = process.env.FB_PAGE_ID;
  }
  if (!settings.accessToken && process.env.FB_PAGE_ACCESS_TOKEN) {
    settings.accessToken = process.env.FB_PAGE_ACCESS_TOKEN;
  }

  return settings;
}

export async function saveFacebookSettings(newSettings: Partial<FacebookSettings>): Promise<FacebookSettings> {
  const current = await getFacebookSettings();
  const updated: FacebookSettings = {
    ...current,
    ...newSettings
  };
  await writePersistentDataAsync('fb_settings', updated);
  return updated;
}

/**
 * Formats a clean, high-engagement Facebook post message in Romanized Manipuri
 */
export function formatFacebookRashifalPost(data: DailyRashifalData, siteUrl = 'https://kuthiyengpham.in'): { message: string; link: string } {
  const link = `${siteUrl}/daily-rashifal?date=${data.date}`;

  const lines: string[] = [
    `✨ ꯀꯨꯊꯤꯌꯦꯡꯐꯝ / Kuthiyengpham Ngasi gi Rashifal ✨`,
    `📅 ${data.formattedDate}`,
    ``,
    `🌟 Rashi 1 dagi 12 faobagi ngasigi aphaba mangol:`,
    ``
  ];

  data.items.forEach((item) => {
    // Keep each sign to a crisp 1-2 sentence hook for Facebook
    const shortOverview = item.overview.length > 120 ? item.overview.slice(0, 117) + '...' : item.overview;
    const rashiDisplay = item.bengaliName ? `${item.bengaliName} • ${item.name}` : item.name;
    lines.push(`${item.symbol} ${item.serial}. ${rashiDisplay} (${item.englishName}): ${shortOverview}`);
  });

  lines.push(``);
  lines.push(`👉 Thabak, Sen-thum, Nungsiba, Haksel amadi Laining-Laison Upay kupna yengbiyu:`);
  lines.push(`🔗 ${link}`);
  lines.push(``);
  lines.push(`#KuthiYengpham #DailyRashifal #ManipuriAstrology #NgasiRashifal #HoroscopeToday #Kangleipak #AstrologyManipur`);

  return {
    message: lines.join('\n'),
    link
  };
}

/**
 * Publishes daily rashifal to Facebook Page using Meta Graph API
 */
export async function publishDailyRashifalToFacebook(data: DailyRashifalData): Promise<{
  success: boolean;
  postId?: string;
  error?: string;
  messagePreview: string;
}> {
  const settings = await getFacebookSettings();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kuthiyengpham.in';
  const { message, link } = formatFacebookRashifalPost(data, siteUrl);

  if (!settings.pageId || !settings.accessToken) {
    const errorMsg = 'Facebook Page ID or Access Token is missing.';
    console.error('[facebookPublisher]', errorMsg);
    await recordPostHistory({
      id: `fb_post_${data.date}_${Date.now()}`,
      date: data.date,
      status: 'failed',
      error: errorMsg,
      postedAt: new Date().toISOString(),
      messagePreview: message.slice(0, 200) + '...'
    });
    return { success: false, error: errorMsg, messagePreview: message };
  }

  try {
    let postId: string | undefined = undefined;
    let photoUploadSucceeded = false;

    // 1. Try uploading as a native Photo Post with clean generated "Ngasi gi Rashifal & Date" image
    try {
      const imgResponse = generateDailyRashifalImage(data.date);
      const arrayBuffer = await imgResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const formData = new FormData();
      formData.append('source', new Blob([buffer], { type: 'image/png' }), `rashifal_${data.date}.png`);
      formData.append('caption', message);
      formData.append('access_token', settings.accessToken);

      const photoRes = await fetch(`https://graph.facebook.com/v19.0/${settings.pageId}/photos`, {
        method: 'POST',
        body: formData,
      });

      const photoData = await photoRes.json();
      if (photoRes.ok && (photoData.id || photoData.post_id)) {
        postId = photoData.post_id || photoData.id;
        photoUploadSucceeded = true;
        console.log('[facebookPublisher] Successfully posted photo post to Facebook! Post ID:', postId);
      } else {
        console.warn('[facebookPublisher] Photo upload note, falling back to feed:', photoData.error?.message || photoData);
      }
    } catch (imgErr) {
      console.warn('[facebookPublisher] Direct image upload failed, falling back to feed:', imgErr);
    }

    // 2. If photo upload wasn't used or failed, fall back to /feed
    if (!photoUploadSucceeded) {
      const fbApiUrl = `https://graph.facebook.com/v19.0/${settings.pageId}/feed`;
      const params = new URLSearchParams();
      params.append('message', message);
      params.append('link', link);
      params.append('access_token', settings.accessToken);

      const response = await fetch(fbApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        const errMsg = result.error?.message || `Facebook API error HTTP ${response.status}`;
        console.error('[facebookPublisher] Post failed:', errMsg);

        await recordPostHistory({
          id: `fb_post_${data.date}_${Date.now()}`,
          date: data.date,
          status: 'failed',
          error: errMsg,
          postedAt: new Date().toISOString(),
          messagePreview: message.slice(0, 200) + '...'
        });

        return { success: false, error: errMsg, messagePreview: message };
      }

      postId = result.id;
      console.log('[facebookPublisher] Successfully posted to Facebook! Post ID:', postId);
    }

    // Update settings with last posted info
    await saveFacebookSettings({
      lastPostedDate: data.date,
      lastPostId: postId
    });

    // Record in history
    await recordPostHistory({
      id: `fb_post_${data.date}_${Date.now()}`,
      date: data.date,
      postId,
      status: 'success',
      postedAt: new Date().toISOString(),
      messagePreview: message.slice(0, 200) + '...'
    });

    return {
      success: true,
      postId,
      messagePreview: message
    };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    console.error('[facebookPublisher] Unexpected network error:', errMsg);

    await recordPostHistory({
      id: `fb_post_${data.date}_${Date.now()}`,
      date: data.date,
      status: 'failed',
      error: errMsg,
      postedAt: new Date().toISOString(),
      messagePreview: message.slice(0, 200) + '...'
    });

    return { success: false, error: errMsg, messagePreview: message };
  }
}

async function recordPostHistory(record: FacebookPostRecord) {
  try {
    const history = await readPersistentDataAsync<FacebookPostRecord[]>('fb_post_history', []);
    const updated = [record, ...history.slice(0, 49)]; // keep latest 50 posts
    await writePersistentDataAsync('fb_post_history', updated);
  } catch (e) {
    console.warn('[facebookPublisher] Could not write post history:', e);
  }
}

export async function getFacebookPostHistory(): Promise<FacebookPostRecord[]> {
  return await readPersistentDataAsync<FacebookPostRecord[]>('fb_post_history', []);
}
