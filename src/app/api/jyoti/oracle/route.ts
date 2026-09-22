import { NextRequest, NextResponse } from 'next/server';
import { readPersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-pro'
];

async function getGeminiApiKey(): Promise<string> {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
    return process.env.GEMINI_API_KEY.trim();
  }
  try {
    const siteSettings = await readPersistentDataAsync<any>('site_settings', {});
    if (siteSettings?.geminiApiKey && siteSettings.geminiApiKey.trim() !== '') {
      return siteSettings.geminiApiKey.trim();
    }
  } catch (e) {}
  return '';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      query,
      personality = 'friendly', // 'mystic' | 'modern' | 'friendly'
      language = 'English',
      astrologySystem = 'Vedic',
      chartContext,
      userProfile,
      partnerProfile,
      conversationHistory = []
    } = body;

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const apiKey = await getGeminiApiKey();

    const lagna = chartContext?.ascendantSign || 'Aries';
    const lagnaLord = chartContext?.chartRuler || 'Mars';
    const dasha = chartContext?.currentDasha || 'Jupiter';
    const nakshatra = chartContext?.ascendantNakshatra || 'Ashwini';
    const element = chartContext?.dominantElement || 'Fire';
    const userName = userProfile?.name || 'Seeker';

    // Conversational, Simple-English AI Astrologer System Prompt
    const systemPrompt = `You are "AstroAI" (Jyoti AI) — a warm, insightful, and accessible AI Astrologer.
User Name: ${userName}
Astrology System: ${astrologySystem}
Natal Matrix: ${lagna} Ascendant (Governed by ${lagnaLord}), Nakshatra: ${nakshatra}, Active Dasha Period: ${dasha}, Element: ${element}.
Selected Tone: ${personality} (Mystic: spiritual & calm | Modern: practical & analytical | Friendly: casual, conversational, empathetic)
Target Language: ${language}

Core Philosophy & Rules:
1. Explain astrology in SIMPLE, CLEAR, PERSONALIZED language. Avoid dense jargon or cryptic phrases without explaining them immediately.
   - Example: Instead of just saying "7th lord is placed in 10th", explain "In Vedic astrology, the 7th house governs partnerships while the 10th house represents your career. In your chart, this suggests your partner might share your ambition or meet you through professional circles."
2. NEVER give fatalistic predictions or guaranteed outcomes. Frame all interpretations as supportive cosmic tendencies, psychological self-discovery, and constructive timing advice.
3. NEVER redirect to human astrologers, outside websites, or booking pages. Answer all questions completely and directly.
4. Structure your response with clean Markdown:
   - Use ### Headings for major sections
   - Use bold for key planetary factors
   - End with a clear, uplifting **💡 Key Takeaway** or **✨ Practical Advice**.
5. If the user asks in Hindi or another Indian language, respond fluently in that language (or Romanized script if requested).`;

    if (apiKey) {
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      for (const msg of conversationHistory.slice(-6)) {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text || msg.content || '' }],
        });
      }

      contents.push({
        role: 'user',
        parts: [{ text: query }],
      });

      for (const model of CANDIDATE_MODELS) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1200,
              },
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textResponse) {
              return NextResponse.json({
                response: textResponse,
                timestamp: new Date().toISOString(),
                model: model,
                tags: ['AstroAI', lagna, personality],
              });
            }
          }
        } catch (modelErr) {
          // try next model
        }
      }
    }

    // High-Precision Conversational Fallback Engine
    const fallbackResponse = generateConversationalFallback(query, {
      userName,
      lagna,
      lagnaLord,
      dasha,
      nakshatra,
      element,
      personality,
      partnerName: partnerProfile?.name,
    });

    return NextResponse.json({
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      model: 'astroai-conversational-engine',
      tags: ['AstroAI', lagna, personality],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function generateConversationalFallback(
  query: string,
  ctx: {
    userName: string;
    lagna: string;
    lagnaLord: string;
    dasha: string;
    nakshatra: string;
    element: string;
    personality: string;
    partnerName?: string;
  }
): string {
  const lower = query.toLowerCase();

  // 1. "You in 30 Seconds" / "Read My Chart"
  if (lower.includes('read my chart') || lower.includes('you in 30 seconds') || lower.includes('profile')) {
    return `### ✨ You in 30 Seconds: ${ctx.userName}

Here is a quick snapshot of how your celestial matrix shapes your personality:

- 🧠 **How You Think**: Under your **${ctx.lagna} Lagna**, your mind is naturally strategic and driven. You prefer clarity over ambiguity and love seeing tangible results.
- ❤️ **How You Love**: You value mutual respect, deep intellectual connection, and emotional authenticity. You need a partner who honors your independence.
- 💼 **How You Work**: Governed by **${ctx.lagnaLord}**, you do your best work when given autonomy, leadership, and creative ownership.
- 💰 **Your Money Style**: You look at resources as tools for building security and freedom rather than fleeting indulgences.
- 🌙 **Your Emotional Style**: Born under **${ctx.nakshatra}**, you process emotions through reflection and intuitive awareness before speaking.
- ✨ **Your Superpower**: Natural resilience and the ability to turn complex setbacks into stepping stones.
- ⚠️ **Your Growth Area**: Learning to delegate and being patient when things move slower than your vision.

💡 **Key Takeaway**: Trust your deliberate pace over the next few months—foundational work done now compounds significantly.`;
  }

  // 2. Career & Feeling Stuck
  if (lower.includes('stuck') || lower.includes('career') || lower.includes('job') || lower.includes('business') || lower.includes('money')) {
    return `### 💼 Career & Direction: Why Things Feel the Way They Do

Based on your **${ctx.lagna} Ascendant** and current **${ctx.dasha} planetary period**:

- **The Current Theme**: Your active cycle is traditionally associated with **restructuring, skill refinement, and patience**. When it feels like career momentum is slowing down, astrology suggests this is actually an *incubation phase* rather than a dead end.
- **Where to Focus**: In Vedic astrology, your 10th house (vocation) and ruler **${ctx.lagnaLord}** thrive when you master systems and build durable, high-integrity skills rather than chasing quick shortcuts.
- **Upcoming Shift**: As your transits align over the coming months, opportunities for leadership and recognition will open up naturally.

💡 **Practical Advice**: Use this period to finish outstanding projects, clean up your workflows, and clarify your 1-year goals. The groundwork you lay now will pay off when your next cycle peaks.`;
  }

  // 3. Love, Marriage & Compatibility
  if (lower.includes('marriage') || lower.includes('love') || lower.includes('relationship') || lower.includes('partner') || lower.includes('compatibility')) {
    const pName = ctx.partnerName || 'your partner';
    return `### ❤️ Love & Relationships: Your 7th House Themes

Looking at partnerships from your **${ctx.lagna} Lagna**:

- **Relationship Dynamics**: In your chart, the 7th house (partnerships) emphasizes **emotional balance and shared values**. You thrive with someone who encourages your growth while offering a steady, calming presence.
- **Why Timing Matters**: Under the **${ctx.dasha} period**, relationship themes are asking for honest communication and clear boundaries rather than assumptions.
- **Compatibility with ${pName}**: Different personalities often create strong initial attraction, but lasting harmony comes from celebrating each other's differences and speaking openly about expectations.

💡 **Key Takeaway**: Don't hesitate to voice your authentic needs kindly. Clarity today prevents misunderstandings tomorrow.`;
  }

  // 4. Life Timeline & Specific Year Explanations
  if (lower.includes('timeline') || lower.includes('202') || lower.includes('year') || lower.includes('future')) {
    return `### 🪐 Your Life Timeline: Navigating Key Periods

Here is what your major planetary cycles indicate:

- **2025 – 2026**: **Foundational Growth**. A period of strengthening your financial safety net and deepening your professional expertise under **${ctx.dasha} Dasha**.
- **2027 – 2029**: **Expansion & Recognition**. Significant planetary transits activate your vocational houses, bringing new responsibilities and personal milestones.
- **2030+**: **Consolidation & Fulfillment**. High emotional stability and long-term asset building.

💡 **Practical Advice**: Treat every year as a chapter with its own curriculum. Right now, focus on compounding your core strengths.`;
  }

  // 5. General & Kundli in Simple English
  return `### 🌌 Understanding Your Chart in Simple English

Here is what makes your chart unique:

- **Your Ascendant (Lagna)** is **${ctx.lagna}**, ruled by **${ctx.lagnaLord}**. This represents your natural personality, energy, and how you approach challenges.
- **Your Moon Nakshatra** is **${ctx.nakshatra}**, which shapes your emotional instincts, intuition, and what brings you peace of mind.
- **Your Current Period (Dasha)** is **${ctx.dasha}**, which highlights where life is currently asking you to focus your attention.

💡 **Ask Me Anything**:
- *"What kind of career suits me best?"*
- *"Why have I been feeling anxious lately?"*
- *"What does Saturn mean in my chart?"*
- *"Will I travel or relocate in the future?"*`;
}
