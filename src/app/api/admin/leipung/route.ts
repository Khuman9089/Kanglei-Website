import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const POSTS_FILE = path.join(process.cwd(), 'data', 'leipung_posts.json');
const REPORTS_FILE = path.join(process.cwd(), 'data', 'leipung_reports.json');

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
  const dir = path.dirname(POSTS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(POSTS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function readReports() {
  try {
    if (!fs.existsSync(REPORTS_FILE)) return [];
    const raw = fs.readFileSync(REPORTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeReports(data: any[]) {
  const dir = path.dirname(REPORTS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  try {
    const posts = readPosts();
    const reports = readReports();

    // Sort: pinned first, then newest first
    posts.sort((a: any, b: any) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return NextResponse.json({ success: true, posts, reports });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to read posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, postId, reportId, postData } = body;

    let posts = readPosts();
    let reports = readReports();

    if (action === 'pin') {
      posts = posts.map((p: any) => (p.id === postId ? { ...p, is_pinned: true } : p));
      writePosts(posts);
      return NextResponse.json({ success: true, message: 'Post pinned to top of Leipung feed' });
    }

    if (action === 'unpin') {
      posts = posts.map((p: any) => (p.id === postId ? { ...p, is_pinned: false } : p));
      writePosts(posts);
      return NextResponse.json({ success: true, message: 'Post unpinned' });
    }

    if (action === 'hide') {
      posts = posts.map((p: any) => (p.id === postId ? { ...p, is_hidden: true } : p));
      writePosts(posts);
      return NextResponse.json({ success: true, message: 'Post hidden from public feed' });
    }

    if (action === 'unhide') {
      posts = posts.map((p: any) => (p.id === postId ? { ...p, is_hidden: false } : p));
      writePosts(posts);
      return NextResponse.json({ success: true, message: 'Post unhidden and visible to community' });
    }

    if (action === 'delete') {
      posts = posts.filter((p: any) => p.id !== postId);
      writePosts(posts);
      // Also update any pending reports on this post
      reports = reports.map((r: any) => (r.postId === postId ? { ...r, status: 'ACTION_TAKEN_DELETED' } : r));
      writeReports(reports);
      return NextResponse.json({ success: true, message: 'Post deleted successfully' });
    }

    if (action === 'dismiss_report') {
      reports = reports.map((r: any) => (r.id === reportId ? { ...r, status: 'DISMISSED' } : r));
      writeReports(reports);
      return NextResponse.json({ success: true, message: 'Report dismissed' });
    }

    if (action === 'action_report_hide') {
      reports = reports.map((r: any) => (r.id === reportId ? { ...r, status: 'ACTION_TAKEN_HIDDEN' } : r));
      writeReports(reports);
      posts = posts.map((p: any) => (p.id === postId ? { ...p, is_hidden: true } : p));
      writePosts(posts);
      return NextResponse.json({ success: true, message: 'Content hidden and report resolved' });
    }

    if (action === 'official_post') {
      const { content_text, media_urls, category_tag, is_pinned } = postData || {};
      if (!content_text || !content_text.trim()) {
        return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
      }

      const newPost = {
        id: `post-official-${Date.now()}`,
        author: {
          id: 'user-official',
          name: 'Kanglei Astro Official',
          avatar_url: '',
          badge: 'Official Astrologer',
          is_verified: true,
          color: 'bg-amber-600',
        },
        content_text: content_text.trim(),
        media_urls: Array.isArray(media_urls) ? media_urls : [],
        category_tag: category_tag?.trim() || '#Official',
        likes_count: 0,
        khurumjari_count: 0,
        comments_count: 0,
        shares_count: 0,
        is_pinned: !!is_pinned,
        is_hidden: false,
        created_at: new Date().toISOString(),
      };

      posts.unshift(newPost);
      writePosts(posts);

      return NextResponse.json({ success: true, post: newPost, message: 'Official announcement published to Leipung feed' });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Moderation action failed' }, { status: 500 });
  }
}
