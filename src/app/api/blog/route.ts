import { NextResponse } from 'next/server';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  readTime: string;
  publishedAt: string;
  views: number;
  likes: number;
  isFeatured?: boolean;
  status: 'PUBLISHED' | 'DRAFT';
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'saturn-sade-sati-phases-and-remedies',
    title: 'Understanding Saturn Sade Sati Phases & Effective Vedic Remedies',
    excerpt: 'Explore the three 2.5-year phases of Saturn Sade Sati and learn practical Jyotish remedies, Hanuman Chalisa recitations, and gemstone guidance.',
    content: `Saturn's 7.5-year transit, known as Sade Sati, is one of the most influential periods in Vedic astrology. It occurs when Saturn transits the 12th, 1st, and 2nd houses from your natal Moon sign.

### The Three Phases of Sade Sati
1. **First Phase (Rising):** Transiting the 12th house from the Moon. Affects financial stability and increases mental restlessness.
2. **Second Phase (Peak):** Transiting directly over your Moon sign. Testing period for career, health, and personal endurance.
3. **Third Phase (Setting):** Transiting the 2nd house. Focuses on family dynamics and rebuilding financial assets.

### Powerful Remedies for Peace
- Recite the **Hanuman Chalisa** daily at sunset.
- Donate black sesame seeds or mustard oil on Saturdays.
- Wear an authenticated **Blue Sapphire (Neelam)** or Amethyst only after precise Kundali chart verification.

> [!TIP]
> Always consult your natal D1 Rashi and D9 Navamsha chart before wearing gemstones during Saturn transits.`,
    category: 'Transits & Dashas',
    coverImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
    author: 'Acharya Tombi Sharma',
    authorRole: 'Master Astrologer (18+ Yrs)',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    readTime: '6 min read',
    publishedAt: '2026-08-25',
    views: 1420,
    likes: 184,
    isFeatured: true,
    status: 'PUBLISHED',
  },
  {
    id: 'post-2',
    slug: 'importance-of-36-gun-ashtakoot-milan',
    title: 'How Ashtakoot 36-Gun Milan Shapes Marriage Compatibility & Harmony',
    excerpt: 'Discover why Ashtakoot matching analyzes Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi for long-term marital bliss.',
    content: `In Vedic astrology, marriage matching goes far beyond surface-level sun signs. The ancient Ashtakoot system assigns 36 Gunas to evaluate deep emotional, psychological, and physiological compatibility between partners.

### Key Kootas Explained
- **Nadi (8 Points):** Ensures genetic health and lineage prosperity.
- **Bhakoot (7 Points):** Evaluates financial growth and mutual happiness.
- **Gana (6 Points):** Measures temperamental compatibility (Deva, Manushya, Rakshasa).
- **Graha Maitri (5 Points):** Assesses planetary friendship and mental understanding.

A score above 18 points is considered favorable, while scores above 28 indicate exceptional alignment.`,
    category: 'Marriage Compatibility',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    author: 'Pandit Ningthem Meitei',
    authorRole: 'Kundali Matching Specialist',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    readTime: '5 min read',
    publishedAt: '2026-08-20',
    views: 980,
    likes: 126,
    isFeatured: false,
    status: 'PUBLISHED',
  },
  {
    id: 'post-3',
    slug: 'power-of-kuthi-yengba-analysis',
    title: 'The Sacred Science of Kuthi Yengba: Unlocking Your Karmic Blueprint',
    excerpt: 'Learn how physical Kuthi paper examination and D1 Rashi / D9 Navamsha chart readings reveal hidden career Yogas and planetary remedies.',
    content: `Kuthi Yengba is the traditional Manipuri practice of horoscope reading and planetary consultation. By examining the precise degree placements of the Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu at birth, an astrologer decodes your life blueprint.

### What Kuthi Yengba Reveals
1. **Dasha Sequence:** Understanding your running Vimshottari Mahadasha & Antardasha.
2. **Wealth Yogas:** Identifying Gajakesari, Dhana, and Raja Yogas in your birth chart.
3. **Remedial Guidance:** Tailored Yantras, gemstones, and charity routines to nullify Malefic planetary impacts.`,
    category: 'Vedic Guidance',
    coverImage: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?q=80&w=1200&auto=format&fit=crop',
    author: 'Guru Sanatomba',
    authorRole: 'Navamsha & Gemologist',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    readTime: '7 min read',
    publishedAt: '2026-08-15',
    views: 1150,
    likes: 152,
    isFeatured: false,
    status: 'PUBLISHED',
  },
];

export async function GET() {
  const posts = await readPersistentDataAsync<BlogPost[]>('blog_posts', DEFAULT_POSTS);
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let posts = await readPersistentDataAsync<BlogPost[]>('blog_posts', DEFAULT_POSTS);

    if (body.action === 'CREATE' || body.action === 'UPDATE') {
      const post: BlogPost = body.post;
      const index = posts.findIndex((p) => p.id === post.id);
      if (index >= 0) {
        posts[index] = { ...posts[index], ...post };
      } else {
        posts.unshift(post);
      }
      await writePersistentDataAsync('blog_posts', posts);
      return NextResponse.json({ success: true, message: 'Blog post saved successfully!', posts });
    }

    if (body.action === 'LIKE') {
      const index = posts.findIndex((p) => p.id === body.id);
      if (index >= 0) {
        posts[index].likes += 1;
        await writePersistentDataAsync('blog_posts', posts);
      }
      return NextResponse.json({ success: true, likes: posts[index]?.likes || 0 });
    }

    if (body.action === 'DELETE') {
      posts = posts.filter((p) => p.id !== body.id);
      await writePersistentDataAsync('blog_posts', posts);
      return NextResponse.json({ success: true, message: 'Blog post deleted successfully!', posts });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
