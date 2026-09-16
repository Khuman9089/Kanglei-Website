import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const COMMENTS_FILE = path.join(process.cwd(), 'data', 'leipung_comments.json');
const POSTS_FILE = path.join(process.cwd(), 'data', 'leipung_posts.json');

function readComments() {
  try {
    if (!fs.existsSync(COMMENTS_FILE)) return [];
    const raw = fs.readFileSync(COMMENTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeComments(data: any[]) {
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

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

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const comments = readComments();
    const postComments = comments.filter((c: any) => c.post_id === id);

    // Sort by date ascending (oldest first in thread)
    postComments.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return NextResponse.json({ success: true, comments: postComments });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to load comments' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { author, comment_text } = body;

    if (!comment_text || !comment_text.trim()) {
      return NextResponse.json({ error: 'Comment text cannot be empty' }, { status: 400 });
    }

    const comments = readComments();

    const newComment = {
      id: `comment-${Date.now()}`,
      post_id: id,
      author: {
        id: author?.id || `user-${Date.now()}`,
        name: author?.name?.trim() || 'Anonymous Member',
        badge: author?.badge || 'Member',
        color: author?.color || 'bg-amber-700',
      },
      comment_text: comment_text.trim(),
      created_at: new Date().toISOString(),
    };

    comments.push(newComment);
    writeComments(comments);

    // Update comment counter in post
    const posts = readPosts();
    const postIndex = posts.findIndex((p: any) => p.id === id);
    if (postIndex !== -1) {
      posts[postIndex].comments_count = (posts[postIndex].comments_count || 0) + 1;
      writePosts(posts);
    }

    return NextResponse.json({ success: true, comment: newComment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to add comment' }, { status: 500 });
  }
}
