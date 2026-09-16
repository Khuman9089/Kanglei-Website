import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const POSTS_FILE = path.join(process.cwd(), 'data', 'leipung_posts.json');

function readPosts() {
  try {
    if (!fs.existsSync(POSTS_FILE)) return [];
    const raw = fs.readFileSync(POSTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writePosts(data: any[]) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { type, is_active } = body; // type: 'like' | 'khurumjari', is_active: boolean

    const posts = readPosts();
    const postIndex = posts.findIndex((p: any) => p.id === id);

    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const post = posts[postIndex];

    if (type === 'like') {
      post.likes_count = Math.max(0, (post.likes_count || 0) + (is_active ? 1 : -1));
    } else if (type === 'khurumjari') {
      post.khurumjari_count = Math.max(0, (post.khurumjari_count || 0) + (is_active ? 1 : -1));
    }

    posts[postIndex] = post;
    writePosts(posts);

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        likes_count: post.likes_count,
        khurumjari_count: post.khurumjari_count,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update reaction' }, { status: 500 });
  }
}
