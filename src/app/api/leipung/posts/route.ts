import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const POSTS_FILE = path.join(process.cwd(), 'data', 'leipung_posts.json');

function readPosts() {
  try {
    if (!fs.existsSync(POSTS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(POSTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading leipung posts:', err);
    return [];
  }
}

function writePosts(data: any[]) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'all';
    const filter = searchParams.get('filter') || 'all';
    const search = searchParams.get('search') || '';

    let posts = readPosts();

    // Filter out hidden posts for public feed
    posts = posts.filter((p: any) => !p.is_hidden);

    // Apply category filter
    if (category && category !== 'all') {
      const catLower = category.toLowerCase();
      posts = posts.filter((p: any) => {
        const pCat = (p.category_tag || '').toLowerCase();
        const pText = (p.content_text || '').toLowerCase();
        return pCat.includes(catLower) || pText.includes(catLower);
      });
    }

    // Apply special tab filters
    if (filter === 'trending') {
      posts = [...posts].sort((a: any, b: any) => (b.likes_count + b.khurumjari_count + b.comments_count) - (a.likes_count + a.khurumjari_count + a.comments_count));
    } else if (filter === 'announcements') {
      posts = posts.filter((p: any) => p.author?.is_verified || p.is_pinned);
    } else if (filter === 'rituals') {
      posts = posts.filter((p: any) => {
        const txt = (p.content_text + ' ' + (p.category_tag || '')).toLowerCase();
        return txt.includes('তর্পণ') || txt.includes('পূজা') || txt.includes('ritual') || txt.includes('কুথি') || txt.includes('পঞ্জিকা');
      });
    }

    // Apply search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      posts = posts.filter(
        (p: any) =>
          p.content_text?.toLowerCase().includes(q) ||
          p.author?.name?.toLowerCase().includes(q) ||
          p.category_tag?.toLowerCase().includes(q)
      );
    }

    // Sort: pinned first, then newest first
    posts.sort((a: any, b: any) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to load posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { author, content_text, media_urls, category_tag } = body;

    if (!content_text || !content_text.trim()) {
      return NextResponse.json({ error: 'Post content cannot be empty' }, { status: 400 });
    }

    const posts = readPosts();

    const isVerifiedOfficial = !!author?.is_verified;

    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        id: author?.id || `guest-${Date.now()}`,
        name: author?.name?.trim() || 'Community Member',
        avatar_url: author?.avatar_url || '',
        badge: author?.badge || 'Community Member',
        is_verified: isVerifiedOfficial,
        color: author?.color || 'bg-amber-600',
      },
      content_text: content_text.trim(),
      media_urls: Array.isArray(media_urls) ? media_urls : [],
      category_tag: category_tag?.trim() || '#Leipung',
      likes_count: 0,
      khurumjari_count: 0,
      comments_count: 0,
      shares_count: 0,
      is_pinned: false,
      // If official, publish immediately; otherwise hold for admin verification
      is_hidden: !isVerifiedOfficial,
      status: isVerifiedOfficial ? 'approved' : 'pending_approval',
      created_at: new Date().toISOString(),
    };

    posts.unshift(newPost);
    writePosts(posts);

    return NextResponse.json({
      success: true,
      post: newPost,
      requires_approval: !isVerifiedOfficial,
      message: isVerifiedOfficial
        ? 'Post published successfully.'
        : 'Your post has been submitted and will appear on the public feed after admin verification.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create post' }, { status: 500 });
  }
}
