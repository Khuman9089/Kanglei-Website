import { NextResponse } from 'next/server';
import { readPersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-pro'
];

async function getGeminiApiKey(): Promise<string> {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
    return process.env.GEMINI_API_KEY.trim();
  }
  // Check settings in persistent store
  try {
    const siteSettings = await readPersistentDataAsync<any>('site_settings', {});
    if (siteSettings?.geminiApiKey && siteSettings.geminiApiKey.trim() !== '') {
      return siteSettings.geminiApiKey.trim();
    }
  } catch (e) {}

  return '';
}

async function callGeminiApi(apiKey: string, bodyPayload: any) {
  let lastError = '';
  let lastStatus = 500;

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      if (response.ok) {
        const data = await response.json();
        return { ok: true, data, modelUsed: model };
      }

      lastStatus = response.status;
      lastError = await response.text();

      // If 404 (model not found / deprecated for this account), try the next model candidate
      if (response.status === 404) {
        continue;
      }

      // If 400 or 403 (invalid key / permission), fail fast unless it's model-specific
      if (response.status === 400 || response.status === 403) {
        try {
          const parsed = JSON.parse(lastError);
          // If error message indicates model not available, try next
          if (parsed?.error?.message?.includes('model') && parsed?.error?.message?.includes('not')) {
            continue;
          }
        } catch (e) {}
        return { ok: false, error: lastError, status: lastStatus };
      }
    } catch (e: any) {
      lastError = e.message || 'Network fetch failed';
    }
  }

  return { ok: false, error: lastError, status: lastStatus };
}

function extractJson(rawText: string): any {
  if (!rawText) return {};
  const clean = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // Find first { and last }
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonSubstring = clean.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonSubstring);
  }
  return JSON.parse(clean);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiKey = (body.apiKey && body.apiKey.trim() !== '') ? body.apiKey.trim() : await getGeminiApiKey();

    if (!apiKey) {
      return NextResponse.json({
        error: 'Gemini API Key is missing. Please add GEMINI_API_KEY in .env.local or Admin Settings.',
        isConfigRequired: true
      }, { status: 400 });
    }

    const { action } = body;

    // 1. GENERATE PRODUCT DETAILS & VEDIC SPECIFICATIONS
    if (action === 'GENERATE_PRODUCT_DETAILS') {
      const { productTitle, title, category, existingInfo } = body;
      const effectiveTitle = productTitle || title || 'Natural Gemstone / Vedic Remedy';

      const prompt = `You are a Vedic Gemology and Sacred Hindu / Manipuri Spiritual Item expert for KangleiAstro.
Generate complete, professional e-commerce catalog information in JSON format for this product:
Product Title: "${effectiveTitle}"
Category: "${category || 'Gemstones'}"
${existingInfo ? `Existing Context: ${JSON.stringify(existingInfo)}` : ''}

Respond ONLY with a valid raw JSON object (no markdown ticks, no commentary) with the following structure:
{
  "title": "refined high-converting title",
  "shortDescription": "2-sentence punchy summary highlighting astrological benefits",
  "description": "2-paragraph detailed description explaining origin, spiritual vibrations, Vedic significance, and authenticity",
  "rulingPlanet": "e.g. Jupiter (Guru / বৃহস্পতি) or relevant deity/planet",
  "zodiacRashi": "e.g. Sagittarius (Dhanu), Pisces (Meen)",
  "color": "e.g. Vivid Golden Canary Yellow",
  "cutShape": "e.g. Oval Brilliant Mixed Cut or Capsule Cabochon",
  "treatment": "e.g. 100% Natural & Untreated / Unheated",
  "certification": "Govt. Lab Certified (GIA / IGI Standards)",
  "recommendedMetal": "e.g. 22K/18K Yellow Gold or Panchdhatu",
  "wearingFinger": "e.g. Index Finger of Right Hand",
  "wearingDayTime": "e.g. Thursday Morning (Shukla Paksha) during Guru Hora",
  "vedicMantra": "e.g. Om Brim Brihaspataye Namah (ॐ बृं बृहस्पतये नमः)",
  "badge": "BESTSELLER • 100% UNHEATED",
  "estimatedPrice": 8999,
  "features": [
    "100% Natural & Authentic Certified",
    "Individually Energized with Vedic Beej Mantras",
    "Lab Testing Certificate with QR Verification",
    "Free Insured Delivery across India"
  ],
  "seoMetaTitle": "SEO title under 60 chars",
  "seoMetaDescription": "SEO meta description under 155 chars"
}`;

      const res = await callGeminiApi(apiKey, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        }
      });

      if (!res.ok) {
        return NextResponse.json({ error: `Gemini API Error: ${res.error}` }, { status: res.status || 500 });
      }

      const rawText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsedData = extractJson(rawText);

      return NextResponse.json({ success: true, data: parsedData, model: res.modelUsed });
    }

    // 2. GENERATE BLOG POST ARTICLE & METADATA
    if (action === 'GENERATE_BLOG_POST') {
      const { topic, category, targetAudience, language } = body;

      const prompt = `You are a Master Vedic and Manipuri Astrology Scholar & Chief Editorial Writer for KangleiAstro.
Write an in-depth, authoritative, SEO-rich blog article in ${language || 'English'} on:
Topic: "${topic}"
Category: "${category || 'Transits & Dashas'}"
Target Audience: "${targetAudience || 'Astrology Seekers & Remedies Shoppers'}"

Format the response ONLY as a valid raw JSON object (no markdown backticks) with this structure:
{
  "title": "Engaging, Click-Worthy SEO Blog Title",
  "slug": "url-friendly-slug-with-hyphens",
  "excerpt": "2-3 sentence compelling summary for search engines and cards",
  "readTime": "5 min read",
  "tags": ["Vedic Astrology", "Planetary Transit", "Remedies"],
  "content": "<h2>Detailed Astrological Significance</h2><p>Rich detailed paragraphs with Vedic remedies, planetary analysis, sacred mantras, and practical life advice.</p><h2>Planetary Influences & Zodiac Impact</h2><p>Detailed insights on rashis...</p><h2>Recommended Vedic Remedies & Sacred Gemstones</h2><p>Advice on wearing certified gemstones, mantras, and energizing malas...</p>",
  "seoMetaTitle": "Catchy Title under 60 chars",
  "seoMetaDescription": "Meta description under 155 chars"
}`;

      const res = await callGeminiApi(apiKey, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 3072,
        }
      });

      if (!res.ok) {
        return NextResponse.json({ error: `Gemini API Error: ${res.error}` }, { status: res.status || 500 });
      }

      const rawText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsedData = extractJson(rawText);

      return NextResponse.json({ success: true, data: parsedData, model: res.modelUsed });
    }

    // 3. ANALYZE IMAGE WITH GEMINI VISION (Identify stone/remedy & auto-fill)
    if (action === 'ANALYZE_IMAGE') {
      const { imageBase64, mimeType } = body;

      if (!imageBase64) {
        return NextResponse.json({ error: 'Image base64 is required for vision analysis' }, { status: 400 });
      }

      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const prompt = `Analyze this gemstone / spiritual sacred item photo for an authentic Vedic astrology e-commerce catalog.
Identify:
1. Exact gemstone or spiritual item name (e.g. Yellow Sapphire / Pukhraj, Blue Sapphire / Neelam, Emerald / Panna, Red Coral, Rudraksha, Shree Yantra, etc.).
2. Color saturation, shape/cut, transparency, and purity.
3. Astrological ruling planet and benefits.
4. Suggested product title and description.

Respond ONLY with raw JSON:
{
  "title": "Natural Ceylon Yellow Sapphire (Pukhraj) Gemstone",
  "category": "Gemstones",
  "description": "High luster natural Ceylon Yellow Sapphire with radiant brilliance, flawless cut, and high spiritual potency.",
  "shortDescription": "Authentic certified gemstone for Jupiter (Guru) blessings, wisdom, and prosperity.",
  "rulingPlanet": "Jupiter (Guru / বৃহস্পতি)",
  "zodiacRashi": "Sagittarius (Dhanu), Pisces (Meen)",
  "color": "Vivid Canary Golden Yellow",
  "cutShape": "Oval Mixed Brilliant Cut",
  "treatment": "100% Natural & Untreated / Unheated",
  "certification": "Govt. Lab Certified (GIA / IGI Standards)",
  "recommendedMetal": "22K/18K Yellow Gold or Panchdhatu",
  "wearingFinger": "Index Finger of Right Hand",
  "wearingDayTime": "Thursday Morning during Shukla Paksha Guru Hora",
  "vedicMantra": "Om Brim Brihaspataye Namah (ॐ बृं बृहस्पतये नमः)",
  "badge": "100% NATURAL & LAB CERTIFIED",
  "estimatedPrice": 9999
}`;

      const res = await callGeminiApi(apiKey, {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType || 'image/jpeg',
                  data: cleanBase64,
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
        }
      });

      if (!res.ok) {
        return NextResponse.json({ error: `Gemini Vision Error: ${res.error}` }, { status: res.status || 500 });
      }

      const rawText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsedData = extractJson(rawText);

      return NextResponse.json({ success: true, data: parsedData, model: res.modelUsed });
    }

    // 4. TEST API KEY VALIDITY
    if (action === 'TEST_KEY') {
      const res = await callGeminiApi(apiKey, {
        contents: [{ parts: [{ text: 'Respond with "OK" in JSON: {"status":"OK"}' }] }],
        generationConfig: { maxOutputTokens: 50 }
      });

      if (!res.ok) {
        let errorMsg = res.error;
        try {
          const parsed = JSON.parse(res.error);
          errorMsg = parsed?.error?.message || res.error;
        } catch (e) {}
        return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: `Gemini API Key is active using model ${res.modelUsed}!` });
    }

    // 5. GENERATE PRODUCT IMAGE DIRECTLY VIA GEMINI
    if (action === 'GENERATE_PRODUCT_IMAGE') {
      const { productTitle, title } = body;
      const effectiveTitle = (productTitle || title || 'Natural Precious Astrological Gemstone').trim();
      const exactPrompt = `product images of ${effectiveTitle}, luxury authentic product photography, centered on solid clean white studio background (#FFFFFF), macro view, flawless facets, brilliant reflection, soft platform drop shadow, 8k resolution, no watermark, no text`;

      const GEMINI_IMAGE_MODELS = [
        'nano-banana-pro-preview',
        'gemini-3.1-flash-image',
        'gemini-2.5-flash-image',
        'gemini-3-pro-image',
        'gemini-3.1-flash-lite-image'
      ];

      let lastError = '';
      for (const model of GEMINI_IMAGE_MODELS) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: exactPrompt }] }],
              generationConfig: {
                responseModalities: ['IMAGE', 'TEXT']
              }
            })
          });

          if (res.ok) {
            const data = await res.json();
            // Look for inlineData in parts
            const parts = data?.candidates?.[0]?.content?.parts || [];
            for (const part of parts) {
              const inline = part.inlineData || part.inline_data;
              if (inline?.data) {
                const mime = inline.mimeType || inline.mime_type || 'image/png';
                return NextResponse.json({
                  success: true,
                  imageUrl: `data:${mime};base64,${inline.data}`,
                  prompt: exactPrompt,
                  source: `Google Gemini (${model})`
                });
              }
            }
          } else {
            const errText = await res.text();
            lastError = errText;
            if (res.status === 429) {
              // Rate limit / daily free tier quota on image generation
              try {
                const parsed = JSON.parse(errText);
                const msg = parsed?.error?.message || 'Gemini Free Tier image quota exceeded for today.';
                return NextResponse.json({
                  success: false,
                  isQuotaExceeded: true,
                  error: msg,
                  suggestedPrompt: exactPrompt,
                  geminiUrl: 'https://gemini.google.com'
                }, { status: 429 });
              } catch (e) {
                return NextResponse.json({
                  success: false,
                  isQuotaExceeded: true,
                  error: 'Gemini Free Tier image quota exceeded for today.',
                  suggestedPrompt: exactPrompt,
                  geminiUrl: 'https://gemini.google.com'
                }, { status: 429 });
              }
            }
          }
        } catch (e: any) {
          lastError = e.message || 'Gemini image generation request failed';
        }
      }

      return NextResponse.json({
        success: false,
        error: `Gemini image generation could not complete: ${lastError}`,
        suggestedPrompt: exactPrompt,
        geminiUrl: 'https://gemini.google.com'
      }, { status: 400 });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (err: any) {
    console.error('Gemini API Route Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
